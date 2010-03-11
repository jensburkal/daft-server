/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.ws.dam.DamAsset;
import com.daftsolutions.lib.ws.dam.DamConnectionInfo;
import com.daftsolutions.lib.ws.dam.DamFieldDescriptor;
import com.daftsolutions.lib.ws.dam.DamRecord;
import java.io.File;
import org.apache.log4j.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Service RESTful requests for images such as:
 * http://myserver/previews/mycatalog/id/1234/small
 * http://myserver/previews/mycatalog/product/AB9876/large
 * The fields that can be used as keys are specified in the servlet init parameters in web.xml.
 *
 * @author Colin Manning
 */
public class PreviewServlet extends RESTfulServlet {

    private static Logger logger = Logger.getLogger(PreviewServlet.class);
    public final static String URL_PARAM_ROTATE = "rotate";
    public final static String URL_PARAM_MAX_SIZE = "maxSize";
    public final static String URL_PARAM_SIZE = "size";
    public final static String URL_PARAM_TOP = "t";
    public final static String URL_PARAM_LEFT = "l";
    public final static String URL_PARAM_WIDTH = "w";
    public final static String URL_PARAM_HEIGHT = "h";
    public final static String URL_PARAM_FORMAT = "format";
    public final static String URL_PARAM_COMNPRESSION_LEVEL = "compressionLevel";
    public final static String URL_PARAM_FORCE = "force";
    public final static String URL_PARAM_CATALOG = "catalog";
    public final static String URL_PARAM_PARENT = "parent";
    public final static String URL_PARAM_PREVIEW_NAME = "previewName";
    public final static String URL_PARAM_ASSET_HANDLING_SET = "assetHandlingSet";
    public final static String PARAM_PREFIX_FIELD = "field";
    public final static String PARAM_PREVIEWS_FIELD = "previews";
    public final static String DEFAULT_PREVIEWS_FIELD = "Previews";
    public final static String PREVIEW_FULL = "full";
    public final static String PREVIEW_THUMBNAIL = "thumbnail";
    public final static String PREVIEW_THUMB = "thumb";
    public final static String PREVIEW_CLEARCACHE = "clearcache";
    public final static int DEFAULT_COMPRESSION_LEVEL = 7;
    public final static String DEFAULT_PREVIEW_FORMAT = "jpg";
    protected Map<String, String> fieldNames = new HashMap<String, String>();
    protected DamFieldDescriptor recordIdFieldDescriptor = null;
    protected Map<String, Map<String, DamFieldDescriptor>> fieldDescriptors = new HashMap<String, Map<String, DamFieldDescriptor>>();
    protected String previewFieldName = DEFAULT_PREVIEWS_FIELD;
    protected int rotateQuadrant = -1;
    protected int previewSize = 0;
    protected int previewTop = -1;
    protected int previewLeft = -1;
    protected int previewWidth = 0;
    protected int previewHeight = 0;
    protected String previewFormat = DEFAULT_PREVIEW_FORMAT;
    protected boolean forcePreview = false;
    protected int compressionLevel = DEFAULT_COMPRESSION_LEVEL;
    protected String cachePreviewName = null;

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        logger.info("PreviewServlet init starting ...");
        Enumeration en = getServletConfig().getInitParameterNames();
        while (en.hasMoreElements()) {
            String param = (String) en.nextElement();
            if (param.startsWith(PARAM_PREFIX_FIELD)) {
                String[] paramBits = param.split(":");
                if (PARAM_PREVIEWS_FIELD.equals(paramBits[1])) {
                    fieldNames.put(PARAM_PREVIEWS_FIELD, getServletConfig().getInitParameter(param));
                    logger.info("Preview field name: '" + fieldNames.get(PARAM_PREVIEWS_FIELD) + "'");
                } else {
                    fieldNames.put(paramBits[1], getServletConfig().getInitParameter(param));
                    logger.info("Field key: '" + paramBits[1] + "' for field '" + getServletConfig().getInitParameter(param) + "'");
                }
            }
        }

        logger.info("Cache Folder  for previews is " + previewCacheManager.getCacheDir().getPath());

        // Setup the field descriptors for each catalog
        for (Map.Entry<String, DamConnectionInfo> conn : connections.entrySet()) {
            DamConnectionInfo connection = conn.getValue();
            logger.debug("Setting up fields for catalog: " + connection.catalogName);
            if (recordIdFieldDescriptor == null) {
                // Record ID is the same for all catalogs, so just get it once
                recordIdFieldDescriptor = getBean().getCatalogRecordFieldDescriptors(connection, new String[]{FIELD_RECORD_ID})[0];
            }
            HashMap<String, DamFieldDescriptor> catalogFieldDescriptors = new HashMap<String, DamFieldDescriptor>();
            for (Map.Entry<String, String> field : fieldNames.entrySet()) {
                logger.debug(" --- field: " + connection.catalogName + ":" + field.getValue());
                catalogFieldDescriptors.put(field.getKey(), getBean().getCatalogRecordFieldDescriptors(connection, new String[]{field.getValue()})[0]);
            }
            fieldDescriptors.put(conn.getKey(), catalogFieldDescriptors);
        }
        logger.info("PreviewServlet init done.");
    }

    /**
     * Return the format for the preview based on name specified.
     * Defaults to JPG, if invalid.
     * Nothing clever for now, just compare accepted string names (case insensitive)
     * @return
     */
    private String getMimeType(String formatName) {
        String result = "image/jpeg";
        if (formatName == null || "".equals(formatName)) {
            return result;
        }
        if ("JPG".equalsIgnoreCase(formatName) || "JPEG".equalsIgnoreCase(formatName)) {
            result = "image/jpeg";
        } else if ("GIF".equalsIgnoreCase(formatName)) {
            result = "image/gif";
        } else if ("PNG".equalsIgnoreCase(formatName)) {
            result = "image/png";
        } else if ("BMP".equalsIgnoreCase(formatName)) {
            result = "image/bmp";
        } else if ("PDF".equalsIgnoreCase(formatName)) {
            result = "application/pdf";
        }
        return result;
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //logger.debug("PROFILING preview request start");
        String previewName = null;
        int returnStatus = HttpServletResponse.SC_OK;
        boolean doClearCache = false;
        try {
            String[] pathElements = getPathElements(request);
            // - first is always root "/"
            // - size can be "name" only .r "name:size" - e.g. "small" or "small:72" - if size given, will be created if not there
            // - size of "full" means full preview
            // ,size ,if ,"thumbnail" or ,"thumb" means return the Cumulus thumbnail ,field data
            // 5 parameters means /catalogName/fieldId/size/id
            // 4 parameters /catalogName/id/size (assumes record id if 3rd is a valid Integer) or /catalogName/fieldId/id (if 3rd String, assunf "full" preview for given field
            boolean ok = false;
            boolean useRecordId = false;
            String catalogName = null;
            String fieldId = null;
            String id = null;
            boolean maxSize = false;
            boolean rotate = false;
            boolean crop = false;
            boolean catalogPreview = false;
            int previewParentId = -1;
            if (pathElements == null) {
                logger.debug("Invalid URL - no path elements");
            } else if (pathElements.length < 3) {
                logger.debug("Invalid URL - too few path elements");
            }
            if (pathElements.length == 5) {
                // field id, value of field id, and preview name
                catalogName = pathElements[1];
                fieldId = pathElements[2];
                id = pathElements[3];
                previewName = pathElements[4];
                if (FIELD_RECORD_ID.equals(fieldId)) {
                    useRecordId = true;
                }
                if (PREVIEW_CLEARCACHE.equals(previewName)) {
                    doClearCache = true;
                }
                ok = true;
            } else if (pathElements.length == 4) {
                // assume record id, or fieldId with "full" preview
                catalogName = pathElements[1];
                try {
                    // record id with size if an Integer specified
                    id = new Integer(pathElements[2]).toString(); // check to see if it is a valid number
                    previewName = pathElements[3];
                    fieldId = FIELD_RECORD_ID;
                    if (PREVIEW_CLEARCACHE.equals(previewName)) {
                        doClearCache = true;
                    }
                    useRecordId = true;
                } catch (NumberFormatException nfe) {
                    // fieldId and assume "full" if non Integer specified
                    fieldId = pathElements[2];
                    id = pathElements[3];
                    previewName = PREVIEW_FULL;
                    if (FIELD_RECORD_ID.equals(fieldId)) {
                        useRecordId = true;
                    }
                }
                ok = true;
            } else if (pathElements.length == 3) {
                // assume record id and full preview
                catalogName = pathElements[1];
                id = pathElements[2];
                previewName = PREVIEW_FULL;
                fieldId = FIELD_RECORD_ID;
                useRecordId = true;
                ok = true;
            } else {
                logger.info("Invalid URL for PreviewServlet: '" + request.getPathInfo() + "'");
            }
            //logger.debug("PROFILING preview request url parsed");

            rotateQuadrant = -1;
            previewTop = -1;
            previewLeft = -1;
            previewWidth = 0;
            previewHeight = 0;
            previewFormat = DEFAULT_PREVIEW_FORMAT;
            forcePreview = false;
            cachePreviewName = null;
            Enumeration paramNames = request.getParameterNames();
            while (paramNames.hasMoreElements()) {
                String paramName = (String) paramNames.nextElement();
                if (URL_PARAM_MAX_SIZE.equals(paramName)) {
                    try {
                        previewSize = new Integer(request.getParameter(paramName));
                        maxSize = true;
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview max size: " + request.getParameter(paramName));
                        ok = false;
                    }
                } else if (URL_PARAM_PREVIEW_NAME.equals(paramName)) {
                    // for cache clearing
                    cachePreviewName = request.getParameter(paramName);
                    logger.debug("cache preview name: "+cachePreviewName);
                } else if (URL_PARAM_ROTATE.equals(paramName)) {
                    try {
                        rotateQuadrant = new Integer(request.getParameter(paramName));
                        if (rotateQuadrant < 1 || rotateQuadrant > 3) {
                            throw new NumberFormatException("rotation quadrand must be 1, 2 or 3");
                        }
                        rotate = true;
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview rotation degrees: " + request.getParameter(paramName));
                        ok = false;
                    }
                } else if (URL_PARAM_SIZE.equals(paramName)) {
                    try {
                        previewSize = new Integer(request.getParameter(paramName));
                        previewWidth = previewSize;
                        previewHeight = previewSize;
                        crop = true;
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview size: " + request.getParameter(paramName));
                        ok = false;
                    }
                } else if (URL_PARAM_ASSET_HANDLING_SET.equals(paramName)) {
                    assetHandlingSet = request.getParameter(URL_PARAM_ASSET_HANDLING_SET);
                } else if (URL_PARAM_FORMAT.equals(paramName)) {
                    previewFormat = request.getParameter(paramName);
                } else if (URL_PARAM_FORCE.equals(paramName)) {
                    forcePreview = true;
                } else if (URL_PARAM_CATALOG.equals(paramName)) {
                    catalogPreview = true;
                } else if (URL_PARAM_PARENT.equals(paramName)) {
                    try {
                        previewParentId = new Integer(request.getParameter(paramName));
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview parent id: " + request.getParameter(paramName) + " ignoring");
                    }
                } else if (URL_PARAM_COMNPRESSION_LEVEL.equals(paramName)) {
                    try {
                        compressionLevel = new Integer(request.getParameter(paramName));
                        if (compressionLevel < 1 || compressionLevel > 12) {
                            logger.info("invalid compression level (must be 1-12): " + compressionLevel + " using " + DEFAULT_COMPRESSION_LEVEL);
                            compressionLevel = DEFAULT_COMPRESSION_LEVEL;
                        }
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid compression level: " + request.getParameter(paramName));
                        ok = false;
                    }

                } else if (URL_PARAM_WIDTH.equals(paramName)) {
                    try {
                        previewWidth = new Integer(request.getParameter(paramName));
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview width: " + request.getParameter(paramName));
                        ok = false;
                    }
                } else if (URL_PARAM_HEIGHT.equals(paramName)) {
                    try {
                        previewHeight = new Integer(request.getParameter(paramName));
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview height: " + request.getParameter(paramName));
                        ok = false;
                    }
                } else if (URL_PARAM_TOP.equals(paramName)) {
                    try {
                        previewTop = new Integer(request.getParameter(paramName));
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview top: " + request.getParameter(paramName));
                        ok = false;
                    }
                } else if (URL_PARAM_LEFT.equals(paramName)) {
                    try {
                        previewLeft = new Integer(request.getParameter(paramName));
                    } catch (NumberFormatException nfe) {
                        logger.info("invalid preview left: " + request.getParameter(paramName));
                        ok = false;
                    }
                }
            }
            if (previewTop != -1 && previewLeft != -1 && previewWidth != -1 && previewHeight != -1) {
                crop = true;
            } else if (previewWidth > 0 && previewHeight > 0) {
                crop = true;
            }
            if (!ok) {
                logger.info("Cannot generate preview for asset as requested");
                returnStatus = HttpServletResponse.SC_NOT_FOUND;
            } else {
                boolean found = false;
                File cachePath = null;
                File cacheFile = null;
                byte[] preview = null;
                cachePath = previewCacheManager.makeCachePath(catalogName, fieldId, id);
                if (doClearCache) {
                    //logger.info("Clearing cache of files for asset with id: " + id);
                    previewCacheManager.clearPathForRecord(cachePath, id, cachePreviewName);
                } else {
                    cacheFile = previewCacheManager.makeCacheFile(cachePath, id, previewName, forcePreview);
                    if (cacheFile.exists()) {
                        if (!forcePreview) {
                            preview = previewCacheManager.getPreviewData(cacheFile);
                            found = true;
                        }
                    }
                    if (!found) {
                        DamConnectionInfo connection = connections.get(catalogName);
                        Integer recordId = -1;
                        if (useRecordId) {
                            recordId = new Integer(id);
                        } else {
                            String query = "\"" + fieldDescriptors.get(catalogName).get(fieldId).guid + "\" == \"" + id + "\"";
                            recordId = getBean().findRecord(connections.get(catalogName), query, Locale.getDefault().getDisplayName());
                        }
                        if (recordId > 0) {
                            //logger.debug("looking for preview called: '" + previewName + "' for record id: " + record.id + " using guid: " + fieldDescriptors.get(catalogName).get(PARAM_PREVIEWS_FIELD).guid);
                            if (PREVIEW_FULL.equals(previewName)) {
                                preview = getBean().getAssetFullPreview(connection, recordId, cacheFile);
                            } else if (PREVIEW_THUMBNAIL.equals(previewName) || PREVIEW_THUMB.equals(previewName)) {
                                preview = getBean().getAssetThumbnail(connections.get(catalogName), recordId);
                            } else if (maxSize && rotate) {
                                preview = getBean().buildAssetMaxSizePreview(connection, recordId, compressionLevel, previewSize, rotateQuadrant, previewFormat, cacheFile);
                            } else if (maxSize) {
                                preview = getBean().buildAssetMaxSizePreview(connection, recordId, compressionLevel, previewSize, 0, previewFormat, cacheFile);
                            } else if (crop) {
                                String[] nameBits = previewName.split(":");
                                if (nameBits.length > 1) {
                                    preview = getBean().getAssetPreviewByName(connection, recordId, previewName, compressionLevel, rotateQuadrant, previewFormat, cacheFile);
                                } else {
                                    preview = getBean().getAssetPreviewByName(connection, recordId, previewName, compressionLevel, previewTop, previewLeft, previewWidth, previewHeight, rotateQuadrant, previewFormat, cacheFile);
                                }
                            } else if (rotate) {
                                preview = getBean().buildAssetRotatePreview(connection, recordId, compressionLevel, rotateQuadrant, previewFormat, cacheFile);
                            }
                            if (preview == null) {
                                logger.info("failed to get preview: '" + previewName + "' for record id: " + recordId + " using guid: " + fieldDescriptors.get(catalogName).get(PARAM_PREVIEWS_FIELD).guid);
                            } else {
                                if (catalogPreview) {
                                    DamAsset asset = new DamAsset();
                                    // name should have contenxt, use source record id  (record name would be better but not available)
                                    asset.name = id + "_" + previewName;
                                    asset.data = preview;
                                    DamRecord record = getBean().createAssetVariant(connection, previewParentId, asset, assetHandlingSet);
                                }
                            }
                        } else {
                            logger.info("Cannot find record from URL: '" + request.getPathInfo() + " in catalog: " + connections.get(catalogName).catalogName);
                        }
                    }
                    if (!found) {
                        if (preview != null) {
                            if (preview.length > 0) {
                                returnStatus = HttpServletResponse.SC_OK;
                            } else {
                                returnStatus = HttpServletResponse.SC_NOT_FOUND;
                            }
                        } else {
                            returnStatus = HttpServletResponse.SC_NOT_FOUND;
                        }
                    } else {
                        if (preview.length > 0) {
                            returnStatus = HttpServletResponse.SC_OK;
                        } else {
                            returnStatus = HttpServletResponse.SC_NOT_FOUND;
                        }
                    }
                    if (preview != null && preview.length > 0) {
                        response.setContentType(getMimeType(previewFormat));
                        response.setContentLength(preview.length);
                        response.getOutputStream().write(preview);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            returnStatus = HttpServletResponse.SC_NOT_FOUND;
        } finally {
            //logger.debug("preview return status: " + returnStatus);
            if (returnStatus != HttpServletResponse.SC_OK) {
                response.sendError(returnStatus);
            }
            if (!doClearCache) {
                response.getOutputStream().flush();
                response.getOutputStream().close();
            }
            response.setStatus(returnStatus);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }// </editor-fold>

    /**
     * Returns a short description of the servlet.
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Daft.Server PreviewServlet";
    }
}
