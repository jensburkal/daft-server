/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.utils.SimpleEntry;
import com.daftsolutions.lib.ws.beans.CumulusBean;
import com.daftsolutions.lib.ws.beans.DamBean;
import com.daftsolutions.lib.ws.dam.DamConnectionInfo;
import com.daftsolutions.lib.ws.dam.DamFieldDescriptor;
import java.io.File;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import org.apache.log4j.Logger;

/**
 *
 * @author Colin
 */
public class DamHelperServlet extends HttpServlet {

    public final static String VERSION_NUMBER = "3.7";
    private static Logger logger = Logger.getLogger(DamHelperServlet.class);
    // constants
    public final static String SOURCE_CUMULUS = "cumulus";
    public final static String SOURCE_FLICKR = "flickr";
    public final static String DEPLOY_MODE_DEVELOMENT = "development";
    public final static String DEPLOY_MODE_TEST = "test";
    public final static String DEPLOY_MODE_PRODUCTION = "production";
    public final static String DEFAULT_DEPLOY_MODE = DEPLOY_MODE_PRODUCTION;
    public final static String DEFAULT_GUEST_USER = "guest";
    public final static String DEFAULT_ASSET_HANDLING_SET = "Standard";

    /*
     * Context parameters for access form other servlets
     */
    public final static String PARAM_LICENSE = "license";
    public final static String DAM_BEAN = "Dam-Bean";
    public final static String DAM_CONNECTIONS = "Dam-Connections";
    public final static String DAM_RECORD_FIELD_DESCRIPTORS = "Dam-Record-Field-Descriptors";
    public final static String DAM_CATEGORY_FIELD_DESCRIPTORS = "Dam-Category-Field-Descriptors";
    public final static String DAM_URL_FIELDS = "Dam-Url-Fields";
    public final static String PREVIEW_MAPPING = "Preview-Mapping";
    public final static String METADATA_MAPPING = "Metadata-Mapping";
    public final static String BASE_URL = "Base-Url";
    public final static String CACHE_DIR = "Cache-Dir";
    public final static String CLOAKED_URLS = "Cloaked-Urls";
    public final static String ASSET_HANDLING_SET = "Asset-Handling-Set";
    public final static String PARAM_BASE_URL = "baseurl";
    public final static String PARAM_GUEST_USER = "guest-user";
    public final static String PARAM_PREVIEW_MAPPING = "servlet-mapping-preview";
    public final static String PARAM_METADATA_MAPPING = "servlet-mapping-metadata";
    public final static String PARAM_DEPLOY_MODE = "deploy-mode";
    public final static String PARAM_CLOAK_SEED = "cloak-seed";
    public final static String PARAM_PREFIX_QUERY = "query";
    public final static String PARAM_PREFIX_VIEW = "view";
    public final static String PARAM_PREFIX_RECORD_VIEW = "record-view";
    public final static String PARAM_PREFIX_CATEGORY_VIEW = "category-view";
    public final static String PARAM_PREFIX_CATALOG = "catalog";
    public final static String PARAM_CATALOG_CLOAK = "cloak";
    public final static String PARAM_CATALOG_SECURE = "secure";
    public final static String PARAM_CATALOG_READONLY = "readonly";
    public final static String PARAM_CATALOG_LICENSES = "licenses=";
    public final static String PARAM_CATALOG_CLONES = "clones=";
    public final static String PARAM_VALUE_ALL = "all";
    public final static String FIELD_ID = "ID";
    public final static String FIELD_URL_PREFIX = "url_";
    public final static String FIELD_THUMBNAIL = "thumbnail";
    public final static String VIEW_IDS = "ids";
    public final static String VIEW_CATEGORY_IDS = "categoryids";
    public final static String TEMPLATE_PARAM_CATALOG_NAME = "_catalogName_";
    public final static String TEMPLATE_PARAM_ID = "_id_";
    public final static String PREVIEW_ENABLE_CACHE = "enable-cache";
    public final static String PREVIEW_CACHE_DIR = "cache-dir";
    public final static String MCAL_CONFIG = "mcal-config";
    public final static String VIEW_ALL = "all";
    // local variables
    private DamBean damBean = null;
    private HashMap<String, String> recordViews = new HashMap<String, String>();
    private HashMap<String, String> categoryViews = new HashMap<String, String>();
    private HashMap<String, String> queries = new HashMap<String, String>();
    private HashMap<String, DamConnectionInfo> connections = new HashMap<String, DamConnectionInfo>();
    private DamFieldDescriptor recordIdFieldDescriptor = null;
    private DamFieldDescriptor categoryIdFieldDescriptor = null;
    private HashMap<String, Map<String, DamFieldDescriptor[]>> recordFieldDescriptors = new HashMap<String, Map<String, DamFieldDescriptor[]>>();
    private HashMap<String, Map<String, SimpleEntry[]>> urlFields = new HashMap<String, Map<String, SimpleEntry[]>>();
    private HashMap<String, Map<String, DamFieldDescriptor[]>> categoryFieldDescriptors = new HashMap<String, Map<String, DamFieldDescriptor[]>>();
    private HashMap<String, String> cloakedUrls = new HashMap<String, String>();
    private String baseUrl = null;
    private String previewMapping = null;
    private String metadataMapping = null;
    private File cacheDir = null;
    private String guestUser = DEFAULT_GUEST_USER;
    //TODO sort this out
    public final static String TRUE = "true";
    public final static String FALSE = "false";
    public final static int DEFAULT_LICENSES = 0;
    public final static int DEFAULT_CLONES = 1;
    private int defaultLicenses = DEFAULT_LICENSES;
    private int defaultClones = DEFAULT_CLONES;
    private String deployMode = DEFAULT_DEPLOY_MODE;
    private String assetHandlingSet = DEFAULT_ASSET_HANDLING_SET;
    private boolean licensed = false;

    // just for Philip training
    private boolean checkLicense(String license) {
        boolean result = true;
        if (license != null) {
            // do license check
        }
        return result;
    }

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        try {
            logger.info("Daft.Server Version " + VERSION_NUMBER + " using Daft.Lib Version " + CumulusBean.VERSION_NUMBER);
            logger.info("CumulusHelperServlet init starting ...");
            ServletContext context = getServletConfig().getServletContext();
            licensed = checkLicense(context.getInitParameter(PARAM_LICENSE));
            if (!licensed) {
                // log and throw exception
            }

            // initialise properties for web services
            Properties properties = new Properties();
            String p = context.getInitParameter(CumulusBean.CUMULUS_ASSET_HANDLING_SET);
            if (p != null) assetHandlingSet = p;
            properties.setProperty(CumulusBean.CUMULUS_ASSET_HANDLING_SET, assetHandlingSet);
            properties.setProperty(CumulusBean.TEMP_DIR, context.getInitParameter(CumulusBean.TEMP_DIR));
            properties.setProperty(CumulusBean.CACHE_DIR, context.getInitParameter(CumulusBean.CACHE_DIR));

            damBean = new CumulusBean();
            damBean.init(properties);
            context.setAttribute(DAM_BEAN, damBean);

            Enumeration en = context.getInitParameterNames();
            while (en.hasMoreElements()) {
                String param = (String) en.nextElement();
                logger.info("Processing context parameter: " + param);
                if (PREVIEW_CACHE_DIR.equals(param)) {
                    cacheDir = new File(context.getInitParameter(PREVIEW_CACHE_DIR));
                    if (!cacheDir.exists()) {
                        cacheDir.mkdirs();
                    }
                } else if (PARAM_BASE_URL.equals(param)) {
                    baseUrl = context.getInitParameter(PARAM_BASE_URL);
                } else if (PARAM_GUEST_USER.equals(param)) {
                    guestUser = context.getInitParameter(PARAM_GUEST_USER);
                } else if (PARAM_DEPLOY_MODE.equals(param)) {
                    deployMode = context.getInitParameter(PARAM_DEPLOY_MODE);
                } else if (PARAM_PREVIEW_MAPPING.equals(param)) {
                    previewMapping = context.getInitParameter(PARAM_PREVIEW_MAPPING);
                } else if (PARAM_METADATA_MAPPING.equals(param)) {
                    metadataMapping = context.getInitParameter(PARAM_METADATA_MAPPING);
                } else if (param.startsWith(PARAM_PREFIX_QUERY)) {
                    String[] paramBits = param.split(":");
                    queries.put(paramBits[1], context.getInitParameter(param));
                    logger.info("Query: '" + paramBits[1] + "' is '" + context.getInitParameter(param) + "'");
                } else if (param.startsWith(PARAM_PREFIX_VIEW) || param.startsWith(PARAM_PREFIX_RECORD_VIEW)) {
                    // views:catalog:name
                    recordViews.put(param, context.getInitParameter(param));
                    String[] paramBits = param.split(":");
                    if (PARAM_VALUE_ALL.equals(paramBits[1])) {
                        logger.info("Record View: 'all' has all catalog fields");
                    } else {
                        logger.info("Record View: '" + paramBits[2] + "' for catalog '" + paramBits[1] + "' has fields '" + context.getInitParameter(param) + "'");
                    }
                } else if (param.startsWith(PARAM_PREFIX_CATEGORY_VIEW)) {
                    // category-views:catalog:name
                    categoryViews.put(param, context.getInitParameter(param));
                    String[] paramBits = param.split(":");
                    if (PARAM_VALUE_ALL.equals(paramBits[1])) {
                        logger.info("Category View: 'all' has all catalog fields");
                    } else {
                        logger.info("Category View: '" + paramBits[2] + "' for catalog '" + paramBits[1] + "' has fields '" + context.getInitParameter(param) + "'");
                    }
                } else if (param.startsWith(PARAM_PREFIX_CATALOG)) {
                    String[] paramBits = param.split(":");
                    DamConnectionInfo connection = new DamConnectionInfo();
                    connection.licenseCount = defaultLicenses;
                    connection.cloneCount = defaultClones;
                    connection.name = paramBits[2];
                    connection.host = paramBits[1];
                    connection.username = paramBits[3];
                    connection.password = paramBits[4];
                    for (String bit : paramBits) {
                        if (PARAM_CATALOG_SECURE.equals(bit)) {
                            connection.secure = true;
                        } else if (PARAM_CATALOG_READONLY.equals(bit)) {
                            connection.readOnly = true;
                        } else if (PARAM_CATALOG_CLOAK.equals(bit)) {
                            connection.cloak = true;
                        } else if (bit.startsWith(PARAM_CATALOG_LICENSES)) {
                            String[] lbits = bit.split("=");
                            try {
                                connection.licenseCount = new Integer(lbits[1]);
                            } catch (Exception e) {
                                logger.info("Error processing catalog alias: '" + param + "'");
                                logger.info("   --- licenses value is invalid");
                            }
                        } else if (bit.startsWith(PARAM_CATALOG_CLONES)) {
                            String[] cbits = bit.split("=");
                            try {
                                connection.cloneCount = new Integer(cbits[1]);
                            } catch (Exception e) {
                                logger.info("Error processing catalog alias: '" + param + "'");
                                logger.info("   --- clones value is invalid");
                            }
                        }
                    }
                    connection.catalogName = context.getInitParameter(param);
                    connections.put(connection.name, connection);
                    logger.info("catalog alias: '" + connection.name + "' for catalog '" + connection.catalogName + " on host '" + connection.host + "' is " + (connection.secure ? "" : "not") + " secure");
                    logger.info("catalog alias: '" + paramBits[2] + "' for catalog '" + connection.catalogName + " on host '" + connection.host + "' is " + (connection.readOnly ? "read-only" : "read-write"));
                }
            }

            // Setup the field descriptors for each catalog
            for (Map.Entry<String, DamConnectionInfo> conn : connections.entrySet()) {
                DamConnectionInfo connection = conn.getValue();
                logger.debug("Setting up record views for catalog: " + connection.catalogName);
                HashMap<String, DamFieldDescriptor[]> catalogRecordFieldDescriptors = new HashMap<String, DamFieldDescriptor[]>();
                HashMap<String, SimpleEntry[]> catalogUrlFields = new HashMap<String, SimpleEntry[]>();
                if (recordIdFieldDescriptor == null) {
                    // Record ID is the same for all catalogs, so just get it once
                    catalogRecordFieldDescriptors.put(VIEW_IDS, damBean.getCatalogRecordFieldDescriptors(connection, new String[]{FIELD_ID}));
                    recordIdFieldDescriptor = catalogRecordFieldDescriptors.get(VIEW_IDS)[0];
                    connection.viewNames.add(VIEW_IDS);
                }

                // get the special view for all fields:
                catalogRecordFieldDescriptors.put(VIEW_ALL, damBean.getCatalogAllRecordFieldDescriptors(connection));
                connection.viewNames.add(VIEW_ALL);

                // now process the record views
                for (Map.Entry<String, String> view : recordViews.entrySet()) {
                    String viewBits[] = view.getKey().split(":");
                    logger.debug("Processing record view '" + view.getKey() + "'");
                    String catalogName = viewBits[1];
                    String viewName = viewBits[2];
                    if (!PARAM_VALUE_ALL.equals(catalogName) && !conn.getKey().equals(catalogName)) {
                        // view not relevant for this catalog
                        continue;
                    }
                    connection.viewNames.add(viewName);
                    logger.debug(" --- record view: " + connection.catalogName + ":" + view.getValue());
                    logger.debug("processing record view: '" + viewName + "'");
                    List<String> fields = new ArrayList<String>();
                    List<String> urls = new ArrayList<String>();
                    String fieldBits[] = view.getValue().split(":");
                    for (String field : fieldBits) {
                        if (field.startsWith(FIELD_URL_PREFIX)) {
                            urls.add(field);
                        } else if (field.equalsIgnoreCase(FIELD_THUMBNAIL)) {
                            // special case for Cumulus Thumbnail field - set to be the thumbnail preview URL
                            urls.add(FIELD_URL_PREFIX + previewMapping + "_" + FIELD_THUMBNAIL);
                        } else {
                            fields.add(field);
                        }
                    }
                    if (urls.size() > 0) {
                        List<SimpleEntry> catUrlFields = new ArrayList<SimpleEntry>();
                        for (int i = 0; i < urls.size(); i++) {
                            logger.debug("field: '" + urls.get(i) + "' is a URL");
                            String url = urls.get(i);
                            String[] bits = url.split("_");
                            if (bits.length == 3) {
                                String templateUrl = baseUrl;
                                if (previewMapping.equals(bits[1])) {
                                    // for previews, the id comes before the preview size
                                    templateUrl += "/" + bits[1] + "/" + TEMPLATE_PARAM_CATALOG_NAME + "/" + TEMPLATE_PARAM_ID + "/" + bits[2]; // _id_ will be replaced with the real id later
                                } else {
                                    templateUrl += "/" + bits[1] + "/" + TEMPLATE_PARAM_CATALOG_NAME + "/" + bits[2] + "/" + TEMPLATE_PARAM_ID; // _id_ will be replaced with the real id later
                                }
                                catUrlFields.add(i, new SimpleEntry<String, String>(bits[1] + "_" + bits[2], templateUrl));
                                logger.debug("template URL is: '" + templateUrl + "'");
                            }
                        }
                        catalogUrlFields.put(viewName, catUrlFields.toArray(new SimpleEntry[0]));
                    }
                    if (fields.size() > 0) {
                        catalogRecordFieldDescriptors.put(viewName, damBean.getCatalogRecordFieldDescriptors(connection, fields.toArray(new String[0])));
                    }
                }
                recordFieldDescriptors.put(conn.getKey(), catalogRecordFieldDescriptors);
                urlFields.put(conn.getKey(), catalogUrlFields);

                logger.debug("Setting up category views for catalog: " + connection.catalogName);
                HashMap<String, DamFieldDescriptor[]> catalogCategoryFieldDescriptors = new HashMap<String, DamFieldDescriptor[]>();
                if (categoryIdFieldDescriptor == null) {
                    // Category ID is the same for all catalogs, so just get it once
                    catalogCategoryFieldDescriptors.put(VIEW_CATEGORY_IDS, damBean.getCatalogCategoryFieldDescriptors(connection, new String[]{FIELD_ID}));
                    categoryIdFieldDescriptor = catalogCategoryFieldDescriptors.get(VIEW_CATEGORY_IDS)[0];
                }

                // now process the category views
                for (Map.Entry<String, String> view : categoryViews.entrySet()) {
                    String viewBits[] = view.getKey().split(":");
                    logger.debug("processing category view '" + view.getKey() + "'");
                    String catalogName = viewBits[1];
                    String viewName = viewBits[2];
                    if (!PARAM_VALUE_ALL.equals(catalogName) && !conn.getKey().equals(catalogName)) {
                        // view not relevant
                        continue;
                    }
                    logger.debug(" --- category view: " + connection.catalogName + ":" + view.getValue());
                    logger.debug("processing category view: '" + viewName + "'");
                    List<String> fields = new ArrayList<String>();
                    String fieldBits[] = view.getValue().split(":");
                    for (String field : fieldBits) {
                        fields.add(field);
                    }
                    if (fields.size() > 0) {
                        catalogCategoryFieldDescriptors.put(viewName, damBean.getCatalogCategoryFieldDescriptors(connection, fields.toArray(new String[0])));
                    }
                }
                categoryFieldDescriptors.put(conn.getKey(), catalogCategoryFieldDescriptors);
            }
            context.setAttribute(ASSET_HANDLING_SET, assetHandlingSet);
            context.setAttribute(CLOAKED_URLS, cloakedUrls);
            context.setAttribute(BASE_URL, baseUrl);
            context.setAttribute(PARAM_DEPLOY_MODE, deployMode);
            context.setAttribute(PREVIEW_MAPPING, previewMapping);
            context.setAttribute(PREVIEW_MAPPING, previewMapping);
            context.setAttribute(METADATA_MAPPING, metadataMapping);
            context.setAttribute(DAM_CONNECTIONS, connections);
            context.setAttribute(DAM_RECORD_FIELD_DESCRIPTORS, recordFieldDescriptors);
            context.setAttribute(DAM_CATEGORY_FIELD_DESCRIPTORS, categoryFieldDescriptors);
            context.setAttribute(DAM_URL_FIELDS, urlFields);
            context.setAttribute(CACHE_DIR, cacheDir);
            String[] formats = ImageIO.getWriterFormatNames();
            for (String format : formats) {
                logger.info("'" + format + "' is a supported preview format");
            }
            logger.info("DAM Helper Servlet init done.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Returns a short description of the servlet.
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Cumulus Helper Servlet";
    }// </editor-fold>

    /**
     *
     */
    public void destroy() {
        logger.info("DAM Helper Servlet being removed by servlet container.");
        damBean.destroy();
        super.destroy();
    }
}
