/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.previewcache.PreviewCacheManager;
import com.oreilly.servlet.multipart.FilePart;
import com.oreilly.servlet.multipart.MultipartParser;
import com.oreilly.servlet.multipart.ParamPart;
import com.oreilly.servlet.multipart.Part;
import com.daftsolutions.lib.utils.Utilities;
import com.daftsolutions.lib.ws.beans.DamBean;
import com.daftsolutions.lib.ws.dam.DamAsset;
import com.daftsolutions.lib.ws.dam.DamCategory;
import com.daftsolutions.lib.ws.dam.DamConnectionInfo;
import com.daftsolutions.lib.ws.dam.DamFieldDescriptor;
import com.daftsolutions.lib.ws.dam.DamFieldValue;
import com.daftsolutions.lib.ws.dam.DamPreview;
import com.daftsolutions.lib.ws.dam.DamRecord;
import com.daftsolutions.lib.ws.dam.DamResultStatus;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author colin
 */
public class UploadServlet extends HttpServlet {

    private static Logger logger = Logger.getLogger(UploadServlet.class);
    public final static String FIELD_RECORD_ID = "ID";
    public final static String FIELD_RECORD_NAME = "Record Name";
    public final static String FIELD_CATEGORY_ID = "ID";
    public final static String FIELD_CATEGORY_NAME = "Category Name";
    public final static String FIELD_CATEGORY_SUBCATEGORIES = "SubCategories";
    public final static String ENCODING_UTF_8 = "UTF-8";
    public final static int DEFAULT_MAX_FILE_SIZE = 20 * 1024 * 1024;
    public final static String DEFAULT_ASSET_HANDLING_SET = "Standard";
    public final static String PARAM_BASE_URL = "baseurl";
    public final static String PARAM_MAX_FILE_SIZE = "max-file-size";
    public final static String PARAM_DEFAULT_ASSET_HANDLING_SET = "default-asset-handling-set";
    public final static String PARAM_PREFIX_ASSET_HANDLING_SET = "asset-handling-set";
    public final static String PARAM_PREFIX_VIEW = "view";
    public final static String PARAM_PREFIX_RECORD_VIEW = "record-view";
    public final static String PARAM_PREFIX_CATALOG = "catalog";
    public final static String PARAM_CATALOG_SECURE = "secure";
    public final static String PARAM_CATALOG_READONLY = "readonly";
    public final static String PARAM_VALUE_ALL = "all";
    public final static String PARAM_PREFIX_PREVIEW = "preview";
    public final static String PARAM_PREVIEW_TYPE = "type";
    public final static String PARAM_PREVIEW_FORMAT = "format";
    public final static String PARAM_PREVIEW_FORCE = "force";
    public final static String PARAM_PREVIEW_COMPRESSIONLEVEL = "compressionLevel";
    public final static String PARAM_PREVIEW_MAXSIZE = "MaxSize";
    public final static String PARAM_PREVIEW_CROPPEDBOX = "CroppedBox";
    public final static String PARAM_PREVIEW_SCALEDBOX = "ScaledBox";
    public final static String PARAM_PREVIEW_SIZE = "size";
    public final static String PARAM_PREVIEW_WIDTH = "w";
    public final static String PARAM_PREVIEW_HEIGHT = "h";
    public final static String PARAM_PREVIEW_TOP = "t";
    public final static String PARAM_PREVIEW_LEFT = "l";
    public final static String PARAM_PREVIEW_FORMAT_JPG = "jpg";
    public final static String PARAM_PREVIEW_FORMAT_png = "png";
    public final static String PARAM_PREVIEW_FORMAT_GIF = "gif";
    public final static String FIELD_ID = "ID";
    public final static String CONTENT_TYPE_FORM = "multipart/form-data";
    public final static String CUMULUS_INPUT_FIELD = "cumulus:";
    public final static String PARAM_REDIRECT = "redirect";
    // variables
    private String assetHandlingSet = DEFAULT_ASSET_HANDLING_SET;
    private int maxFileSize = DEFAULT_MAX_FILE_SIZE;
    private DamBean damBean = null;
    private Map<String, DamConnectionInfo> connections = new HashMap<String, DamConnectionInfo>();
    private Map<String, Map<String, DamFieldDescriptor[]>> recordFieldDescriptors = new HashMap<String, Map<String, DamFieldDescriptor[]>>();
    private ArrayList<DamPreview> previews = new ArrayList<DamPreview>();
    protected PreviewCacheManager previewCacheManager = null;
    //TODO sort this out
    public final static String TRUE = "true";
    public final static String FALSE = "false";

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        logger.info("UploadServlet init starting ...");
        damBean = getBean();
        connections = (Map<String, DamConnectionInfo>) getServletContext().getAttribute(com.daftsolutions.daft.server.servlets.DamHelperServlet.DAM_CONNECTIONS);
        recordFieldDescriptors = (Map<String, Map<String, DamFieldDescriptor[]>>) getServletContext().getAttribute(com.daftsolutions.daft.server.servlets.DamHelperServlet.DAM_RECORD_FIELD_DESCRIPTORS);
        previewCacheManager = new PreviewCacheManager((File) getServletContext().getAttribute(DamHelperServlet.CACHE_DIR));
        initLocalStuff(config);
        logger.info("UploadServlet init done.");
    }

    private void initLocalStuff(ServletConfig config) {
        Enumeration en = getServletConfig().getInitParameterNames();
        while (en.hasMoreElements()) {
            String param = (String) en.nextElement();
            if (PARAM_DEFAULT_ASSET_HANDLING_SET.equals(param)) {
                assetHandlingSet = config.getInitParameter(PARAM_DEFAULT_ASSET_HANDLING_SET);
            } else if (PARAM_MAX_FILE_SIZE.equals(param)) {
                try {
                    maxFileSize = new Integer(config.getInitParameter(PARAM_MAX_FILE_SIZE)) * 1024 * 1024;
                } catch (NumberFormatException nfe) {
                    // do nothing - default will apply
                }
            }
        }
        logger.info("default asset handling set is '" + assetHandlingSet + "'");
        logger.info("maximum file size that can be uploaded is " + maxFileSize + " bytes");
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
    }// </editor-fold>

    /**
     * Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // process upload form parameters
        int returnStatus = HttpServletResponse.SC_NOT_FOUND;
        String redirectUrl = null;
        boolean doUpdate = false;
        try {
            DamConnectionInfo connection = new DamConnectionInfo();
            previews.clear();
            if (!connection.readOnly) {
                int recordId = -1;
                assetHandlingSet = DEFAULT_ASSET_HANDLING_SET;
                Vector<DamAsset> assets = new Vector<DamAsset>();
                Vector<DamCategory> categories = new Vector<DamCategory>();
                logger.debug("UploadServlet content type: " + request.getContentType());
                String[] pathElements = getPathElements(request);
                // - first is always root "/"
                // - catalog alias
                // - view name for field upload - form should have input field names "cumulus:my_field" to map on to these
                String catalogName = null;
                String viewName = null;
                if (pathElements == null) {
                    logger.debug("Invalid URL - no path elements");
                } else if (pathElements.length < 1) {
                    logger.debug("Invalid URL - too few path elements");
                }
                if (pathElements.length > 1) {
                    catalogName = pathElements[1];
                    connection = connections.get(catalogName);
                }
                if (pathElements.length > 2) {
                    // field id, value of field id, and preview name
                    viewName = pathElements[2];
                }

                // look for parameters
                Enumeration paramNames = request.getParameterNames();
                while (paramNames.hasMoreElements()) {
                    String paramName = (String) paramNames.nextElement();
                    if (PARAM_REDIRECT.equals(paramName)) {
                        redirectUrl = request.getParameter(paramName);
                    }
                }
                if (request.getContentType().startsWith(CONTENT_TYPE_FORM)) {
                    MultipartParser parser = new MultipartParser(request, maxFileSize, ENCODING_UTF_8);
                    Part part = null;
                    DamFieldDescriptor[] assetFieldDescriptors = null;
                    DamFieldValue[] assetFields = null;
                    if (viewName == null) {
                        viewName = DamHelperServlet.VIEW_ALL;
                    }
                    assetFieldDescriptors = recordFieldDescriptors.get(catalogName).get(viewName);
                    if (assetFieldDescriptors == null) {
                        if (!DamHelperServlet.VIEW_ALL.equals(viewName)) {
                            // try again with all fields
                            viewName = DamHelperServlet.VIEW_ALL;
                            assetFieldDescriptors = recordFieldDescriptors.get(catalogName).get(viewName);
                        } else {
                            logger.info("cannot find any fields for catalog alias: " + catalogName);
                        }
                    }
                    assetFields = new DamFieldValue[assetFieldDescriptors.length];
                    for (int i = 0; i < assetFields.length; i++) {
                        DamFieldValue assetField = new DamFieldValue();
                        assetFields[i] = assetField;
                    }
                    assets = new Vector<DamAsset>();
                    while ((part = parser.readNextPart()) != null) {
                        logger.debug("processing form part with name: '" + part.getName() + "'");
                        if (part.isFile()) {
                            FilePart filePart = (FilePart) part;
                            String fileName = filePart.getFileName();
                            logger.debug(" - upload file name: '" + fileName + "'");
                            if (fileName == null) {
                                // no file specified in an input field, so ignore
                                continue;
                            }
                            logger.debug("uploading file '" + fileName + "'");
                            DamAsset asset = new DamAsset();
                            asset.name = fileName;
                            asset.data = Utilities.getBytesFromInputStream(filePart.getInputStream());
                            assets.add(asset);
                            logger.debug(" --- asset size is: " + asset.data.length);
                        } else if (part.isParam()) {
                            ParamPart paramPart = (ParamPart) part;
                            String paramName = paramPart.getName();
                            logger.debug(" - processing param part: "+paramName);
                            //logger.debug("processing form param part with name: '" + paramName + "', value: '" + paramPart.getStringValue(ENCODING_UTF_8) + "'");
                            if (PARAM_PREFIX_ASSET_HANDLING_SET.equals(paramName)) {
                                assetHandlingSet = paramPart.getStringValue(ENCODING_UTF_8);
                            } else if (paramName.startsWith(CUMULUS_INPUT_FIELD)) {
                                String[] bits = paramName.split(":");
                                if (bits.length == 2) {
                                    //TODO resolve how handle spaces and underscores more generically
                                    String fieldName = bits[1].replaceAll("_", " ");
                                    if (FIELD_RECORD_ID.equals(fieldName)) {
                                        //logger.debug("--- id value is: '" + paramPart.getStringValue(ENCODING_UTF_8) + "'");
                                        recordId = new Integer(paramPart.getStringValue(ENCODING_UTF_8));
                                        if (recordId > 0) {
                                            // id specified and looks plausabe, so this is an update attempt
                                            doUpdate = true;
                                        }
                                    }
                                    for (int i = 0; i < assetFieldDescriptors.length; i++) {
                                        if (assetFieldDescriptors[i].name.equals(fieldName)) {
                                            try {
                                                String value = paramPart.getStringValue(ENCODING_UTF_8);
                                                if (value.endsWith("\n")) {
                                                    // seems to happen if last parameter and no following file data (e.g. update asset)
                                                    // strip off the training "\n" newline;
                                                    value = value.substring(0, value.length() - 2);
                                                }
                                                assetFields[i] = getBean().createFieldValue(assetFieldDescriptors[i], value);
                                            } catch (Exception e) {
                                                logger.error("problem setting field value: '" + fieldName + "' to '" + paramPart.getStringValue(ENCODING_UTF_8) + "'");
                                            }
                                        }
                                    }
                                }
                            } else if (paramName.startsWith(PARAM_PREFIX_PREVIEW)) {
                                logger.debug("processing preview parameter: " + paramName + " with value: " + paramPart.getStringValue(ENCODING_UTF_8));
                                // process preview requests
                                String[] bits = paramName.split(":");
                                if (bits.length != 2) {
                                    logger.info("Invalid form input preview definition: " + paramName);
                                    continue;
                                }
                                DamPreview preview = new DamPreview();
                                preview.setName(bits[1]);
                                String previewParams = paramPart.getStringValue(ENCODING_UTF_8);
                                String[] paramBits = previewParams.split(",");
                                for (String paramBit : paramBits) {
                                    String[] kvBits = paramBit.split("=");
                                    if (kvBits.length == 1) {
                                        // force just has to exist in parameter, so no key value
                                        if (PARAM_PREVIEW_FORCE.equals(paramBit)) {
                                            preview.setForce(true);
                                        } else {
                                            logger.info("Invalid preview parameter: " + paramBit);
                                        }
                                        continue;
                                    } else if (kvBits.length != 2) {
                                        logger.info("Invalid preview parameter: " + paramBit);
                                        continue;
                                    }
                                    String key = kvBits[0];
                                    String value = kvBits[1];
                                    if (PARAM_PREVIEW_TYPE.equals(key)) {
                                        if (!preview.setTypeByName(value)) {
                                            logger.info("invalid preview type: " + value);
                                        }
                                    } else if (PARAM_PREVIEW_FORMAT.equals(key)) {
                                        if (!preview.setFormatByName(value)) {
                                            logger.info("invalid preview format: " + value);
                                        }
                                    } else if (PARAM_PREVIEW_COMPRESSIONLEVEL.equals(key)) {
                                        try {
                                            preview.setCompressionLevel(Integer.valueOf(value));
                                        } catch (Exception e) {
                                            logger.info("Invalid compression level: " + value);
                                        }
                                    } else if (PARAM_PREVIEW_SIZE.equals(key)) {
                                        try {
                                            preview.setSize(Integer.valueOf(value));
                                        } catch (Exception e) {
                                            logger.info("Invalid size: " + value);
                                        }
                                    } else if (PARAM_PREVIEW_WIDTH.equals(key)) {
                                        try {
                                            preview.setWidth(Integer.valueOf(value));
                                        } catch (Exception e) {
                                            logger.info("Invalid width: " + value);
                                        }
                                    } else if (PARAM_PREVIEW_HEIGHT.equals(key)) {
                                        try {
                                            preview.setHeight(Integer.valueOf(value));
                                        } catch (Exception e) {
                                            logger.info("Invalid height: " + value);
                                        }
                                    } else if (PARAM_PREVIEW_TOP.equals(key)) {
                                        try {
                                            preview.setTop(Integer.valueOf(value));
                                        } catch (Exception e) {
                                            logger.info("Invalid top: " + value);
                                        }
                                    } else if (PARAM_PREVIEW_LEFT.equals(key)) {
                                        try {
                                            preview.setLeft(Integer.valueOf(value));
                                        } catch (Exception e) {
                                            logger.info("Invalid left: " + value);
                                        }
                                    }
                                }
                                previews.add(preview);
                            }
                        }
                    }
                    if (doUpdate) {
                        logger.debug("updating " + assets.size() + " assets in Cumulus");
                        DamRecord record = damBean.getRecordById(connection, assetFieldDescriptors, recordId, null);
                        if (record != null) {
                            for (int i = 0; i < assetFields.length; i++) {
                                record.fieldValues[i] = assetFields[i];
                            }
                            DamResultStatus result = damBean.updateRecord(connection, assetFieldDescriptors, record, categories.toArray(new DamCategory[0]), null);
                            returnStatus = HttpServletResponse.SC_OK;
                        } else {
                            logger.info("attempt to update record with id: " + recordId + " failed");
                            returnStatus = HttpServletResponse.SC_NOT_FOUND;
                        }
                    } else {
                        logger.debug("uploading " + assets.size() + " assets to Cumulus using asset handling set '" + assetHandlingSet + "'");
                        DamRecord[] records = damBean.createAssetsWithData(connection, assets.toArray(new DamAsset[0]), categories.toArray(new DamCategory[0]), assetHandlingSet, assetFieldDescriptors, assetFields, null);
                        logger.debug("Cumulus upload done, number of records returned is " + records.length);
                        logger.debug("Redirect URL " + redirectUrl);

                        // build previews, if required
                        for (DamRecord record : records) {
                            for (DamPreview preview : previews) {
                                // assume field id is FIELD_RECORD_ID for now
                                //TODO make this general, to use other fields for the id - as in PreviewServlet
                                File cacheFile = previewCacheManager.makeCacheFile(catalogName, FIELD_RECORD_ID, String.valueOf(record.id), preview.getName(), preview.isForce());
                                if (record.id != -1) {
                                    logger.debug("processing preview: " + preview.getName() + " for record id: " + record.id + " to cache file: " + cacheFile.getAbsolutePath());
                                    damBean.storeAssetPreview(connection, record.id, preview, cacheFile);
                                }
                            }
                        }

                        // redirect, or output ids
                        if (redirectUrl == null) {
                            List<JSONObject> jsonObjects = new ArrayList<JSONObject>();
                            HashMap<String, Integer> recordIds = new HashMap<String, Integer>();
                            for (DamRecord record : records) {
                                if (record.id != -1) {
                                    logger.info("new asset in Cumulus with id: " + record.id);
                                    recordIds.put("Id", record.id);
                                }
                            }
                            jsonObjects.add(new JSONObject(recordIds));
                            // no redirect so return return record ids
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write(new JSONArray(jsonObjects).toString());
                        }
                        returnStatus = HttpServletResponse.SC_OK;
                    }
                }
            } else {
                returnStatus = HttpServletResponse.SC_NOT_FOUND;
                logger.info("failed - attempt to upload to read only catalog: " + connection.catalogName + " on server: " + connection.host);
            }
        } catch (Exception e) {
            returnStatus = HttpServletResponse.SC_NOT_FOUND;
            e.printStackTrace();
        } finally {
            response.setStatus(returnStatus);
            if (returnStatus == HttpServletResponse.SC_OK && redirectUrl != null) {
                response.sendRedirect(redirectUrl);
            } else if (returnStatus != HttpServletResponse.SC_OK) {
                response.sendError(returnStatus);
            }
        }
    }

    protected String[] getPathElements(HttpServletRequest request) {
        String[] result = null;
        String pathInfo = request.getPathInfo();
        if (pathInfo != null) {
            String decodedURL = null;
            try {
                decodedURL = URLDecoder.decode(pathInfo, "UTF-8");
                result = decodedURL.split("/");
                // for (int i=0;i<result.length;i++) result[i] = result[i].toLowerCase();
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    private DamBean getBean() {
        return (DamBean) getServletContext().getAttribute(com.daftsolutions.daft.server.servlets.DamHelperServlet.DAM_BEAN);
    }

    /**
     * Returns a short description of the servlet.
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Daft UploadServlet for Cumulus";
    }
}
