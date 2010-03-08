/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.utils.CumulusFieldTypes;
import com.daftsolutions.lib.utils.SimpleEntry;
import com.daftsolutions.lib.utils.Utilities;
import com.daftsolutions.lib.ws.dam.DamCategory;
import com.daftsolutions.lib.ws.dam.DamConnectionInfo;
import com.daftsolutions.lib.ws.dam.DamFieldDescriptor;
import com.daftsolutions.lib.ws.dam.DamRecord;
import com.daftsolutions.lib.ws.dam.DamRecordCollection;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author Colin Manning
 */
public class MetadataServlet extends RESTfulServlet {

    private static Logger logger = Logger.getLogger(MetadataServlet.class);
    // definitions
    public final static String URL_PARAM_JSON = "json";
    public final static String URL_PARAM_CSHARP = "csharp";
    public final static String URL_PARAM_OUTPUT = "output";
    public final static String URL_PARAM_FROM = "f";
    public final static String URL_PARAM_COUNT = "c";
    public final static String URL_PARAM_QUERY = "q";
    public final static String URL_PARAM_ID = "id";
    public final static String URL_PARAM_NAME = "name";
    public final static String URL_PARAM_RECORD_ID = "record_id";
    public final static String URL_PARAM_CATEGORY_ID = "category_id";
    public final static String URL_PARAM_PATH = "path";
    public final static String URL_PARAM_TEXT = "text";
    public final static String PARAM_BASE_URL = "baseurl";
    public final static String PARAM_PREVIEW_MAPPING = "servlet-mapping-preview";
    public final static String PARAM_METADATA_MAPPING = "servlet-mapping-metadata";
    public final static String PARAM_PREFIX_QUERY = "query";
    public final static String PARAM_PREFIX_VIEW = "view";
    public final static String FIELD_URL_PREFIX = "url_";
    public final static String FIELD_THUMBNAIL = "thumbnail";
    public final static String VIEW_IDS = "ids";
    public final static String TEMPLATE_PARAM_CATALOG_NAME = "_catalogName_";
    public final static String TEMPLATE_PARAM_ID = "_id_";
    public final static String QUERY_PARAM_PREFIX = "%p";
    public final static String DESCRIBE = "describe";
    public final static String ADD_RECORD = "addrecord";
    public final static String CATEGORY = "category";
    public final static String GET = "get";
    public final static String CREATE = "create";
    public final static String MODIFY = "modify";
    public final static String DELETE = "delete";
    public final static String JSON_FIELD_KEY_NAME = "name";
    public final static String JSON_FIELD_KEY_GUID = "guid";
    public final static String JSON_FIELD_KEY_DATA_TYPE = "dataType";
    public final static String JSON_FIELD_VIEW_NAMES = "viewNames";
    public final static String JSON_FIELD_KEY_VALUE_INTERPRETATION = "valueInterpretation";
    public final static String RECORD_VIEWS = "Record_Views";
    public final static String CATEGORY_VIEWS = "Category_Views";
    public final static String QUICK_SEARCH = "quicksearch";
    public final static String CONNECTIONS = "connections";
    // variables
    private Map<String, String> queries = new HashMap<String, String>();

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        logger.info("COLIN>>>>> MetadataServlet init starting ...");
        ServletConfig servletConfig = getServletConfig();
        Enumeration en = getServletConfig().getInitParameterNames();
        while (en.hasMoreElements()) {
            String param = (String) en.nextElement();
            if (PARAM_BASE_URL.equals(param)) {
                baseUrl = servletConfig.getInitParameter(PARAM_BASE_URL);
            } else if (param.startsWith(PARAM_PREFIX_QUERY)) {
                String[] paramBits = param.split(":");
                queries.put(paramBits[1], getServletConfig().getInitParameter(param));
                logger.info("Query: '" + paramBits[1] + "' is '" + getServletConfig().getInitParameter(param) + "'");
            }
        }
        logger.info("COLIN>>>>> MetadataServlet init done.");
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String[] pathElements = getPathElements(request);
            /*
            for (String pathElement : pathElements) {
            logger.debug("Path element: " + pathElement);
            }
             */
            // 4 parameters means /catalogName/viewName/id or /catalogName/viewName/queryName[?p01=x&p02=y]
            boolean ok = false;
            String categoryPath = null;
            Integer categoryId = null;
            String categoryName = null;
            String categoryOperation = null;
            String catalogName = null;
            int addRecordId = -1;
            int addCategoryId = -1;
            Integer dbId = null;
            String viewName = null;
            String query = null;
            boolean getById = false;
            boolean getByQuery = false;
            boolean quickSearch = false;
            String quickSearchText = null;
            boolean doDescribe = false;
            boolean doDescribeAll = false;
            boolean doDescribeConnections = false;
            boolean doCategory = false;
            int fromIndex = 0;
            int count = 0;
            String queryName = null;
            String describeOutputFormat = URL_PARAM_JSON;
            Enumeration paramNames = null;
            String queryParameter = null;
            if (pathElements.length == 4) {
                catalogName = pathElements[1];
                viewName = pathElements[2];
                if (DESCRIBE.equals(pathElements[3])) {
                    paramNames = request.getParameterNames();
                    while (paramNames.hasMoreElements()) {
                        String paramName = (String) paramNames.nextElement();
                        // just check for parameter existeice for output format - JSON is default
                        if (URL_PARAM_JSON.equals(paramName)) {
                            describeOutputFormat = URL_PARAM_JSON;
                        } else if (URL_PARAM_CSHARP.equals(paramName)) {
                            describeOutputFormat = URL_PARAM_CSHARP;
                        }
                    }
                    doDescribe = true;
                    ok = true;
                } else if (CATEGORY.equals(pathElements[2])) {
                    viewName = null;
                    catalogName = pathElements[1];
                    categoryOperation = pathElements[3];
                    if (GET.equals(categoryOperation)) {
                        categoryPath = request.getParameter(URL_PARAM_PATH);
                        if (categoryPath != null) {
                            categoryPath = URLDecoder.decode(categoryPath, UTF_8);
                        }
                        ok = true;
                    } else if (CREATE.equals(categoryOperation)) {
                        categoryPath = request.getParameter(URL_PARAM_PATH);
                        if (categoryPath != null) {
                            categoryPath = URLDecoder.decode(categoryPath, UTF_8);
                            ok = true;
                        } else {
                            try {
                                categoryId = new Integer(request.getParameter(URL_PARAM_ID));
                            } catch (NumberFormatException nfe) {
                            }
                            categoryName = request.getParameter(URL_PARAM_NAME);
                            if (categoryId != null && categoryName != null) {
                                ok = true;
                            }
                        }
                    } else if (ADD_RECORD.equals(categoryOperation)) {
                        try {
                            if (request.getParameter(URL_PARAM_RECORD_ID) != null) {
                                addRecordId = new Integer(request.getParameter(URL_PARAM_RECORD_ID));
                                if (request.getParameter(URL_PARAM_CATEGORY_ID) != null) {
                                    addCategoryId = new Integer(request.getParameter(URL_PARAM_CATEGORY_ID));
                                }
                            } else {
                                addRecordId = new Integer(request.getParameter(URL_PARAM_ID));
                                if (request.getParameter(URL_PARAM_CATEGORY_ID) != null) {
                                    addCategoryId = new Integer(request.getParameter(URL_PARAM_CATEGORY_ID));
                                }
                            }
                            categoryPath = request.getParameter(URL_PARAM_PATH);
                            ok = true;
                        } catch (NumberFormatException nfe) {
                            logger.debug("invalid id in URL: ");
                            ok = false;
                        }
                    }
                    doCategory = true;
                } else {
                    try {
                        // this is a record id if a valid integer
                        dbId = new Integer(pathElements[3]);
                        getById = true;
                        ok = true;
                    } catch (NumberFormatException nfe) {
                        //ok, then we have a named query
                        queryName = pathElements[3];
                        if (QUICK_SEARCH.equals(queryName)) {
                            quickSearch = true;
                            quickSearchText = request.getParameter(URL_PARAM_TEXT);
                        } else {
                            String queryTemplate = queries.get(queryName);
                            if (queryTemplate != null) {
                                query = queryTemplate;
                                paramNames = request.getParameterNames();
                                while (paramNames.hasMoreElements()) {
                                    String paramName = (String) paramNames.nextElement();
                                    if (URL_PARAM_FROM.equals(paramName)) {
                                        queryParameter = request.getParameter(paramName);
                                        if (queryParameter != null) {
                                            logger.debug("named query parameter for fromIndex is: " + queryParameter);
                                            fromIndex = new Integer(queryParameter);
                                            if (fromIndex < 0) {
                                                logger.debug("ignoring invalid fromIndex: " + queryParameter);
                                                fromIndex = 0;
                                            }
                                        }
                                    } else if (URL_PARAM_COUNT.equals(paramName)) {
                                        queryParameter = request.getParameter(paramName);
                                        if (queryParameter != null) {
                                            logger.debug("named query parameter for count is: " + queryParameter);
                                            count = new Integer(queryParameter);
                                            if (count < 0) {
                                                logger.debug("ignoring invalid count: " + queryParameter);
                                                count = 0;
                                            }
                                        }
                                    } else {
                                        // see if parameter is a template query parameter (e.g. " %p01" "Colin" - note space before percent sign
                                        query = query.replaceFirst(" %" + paramName, " " + request.getParameter(paramName));
                                        query = query.replaceFirst("\"%" + paramName, "\"" + request.getParameter(paramName));
                                    }
                                }
                            }
                        }
                        getByQuery = true;
                        ok = true;
                    }
                }
            } else if (pathElements.length == 3) {
                catalogName = pathElements[1];
                if (DESCRIBE.equals(pathElements[2])) {
                    if (CONNECTIONS.equals(catalogName)) {
                        doDescribeConnections = true;
                    } else {
                        paramNames = request.getParameterNames();
                        while (paramNames.hasMoreElements()) {
                            String paramName = (String) paramNames.nextElement();
                            if (URL_PARAM_JSON.equals(paramName)) {
                                describeOutputFormat = URL_PARAM_JSON;
                            } else if (URL_PARAM_CSHARP.equals(paramName)) {
                                describeOutputFormat = URL_PARAM_CSHARP;
                            }
                        }
                        doDescribeAll = true;
                    }
                    ok = true;
                } else {
                    viewName = pathElements[2];
                    // look for query parameter -"q=("ID" == 104 || "Record Name" == DI05773.JPG) && "Eniro Latitude" > 0
                    // query is valid Cumulus query string, URL encoded - so %26 for ampersand, + for space etc.
                    queryParameter = request.getParameter(URL_PARAM_QUERY);
                    logger.debug("query parameter is: " + queryParameter);
                    if (queryParameter != null) {
                        query = URLDecoder.decode(queryParameter, "UTF-8");
                    }
                    queryParameter = request.getParameter(URL_PARAM_FROM); // from index
                    if (queryParameter != null) {
                        logger.debug("query parameter for fromIndex is: " + queryParameter);
                        fromIndex = new Integer(queryParameter);
                        if (fromIndex < 0) {
                            logger.debug("ignoring invalid fromIndex: " + queryParameter);
                            fromIndex = 0;
                        }
                    }
                    queryParameter = request.getParameter(URL_PARAM_COUNT); // from index
                    if (queryParameter != null) {
                        logger.debug("query parameter for count is: " + queryParameter);
                        count = new Integer(queryParameter);
                        if (count < 0) {
                            logger.debug("ignoring invalid count: " + queryParameter);
                            count = 0;
                        }
                    }
                    getByQuery = true;
                    ok = true;
                }
            } else {
                logger.info("Invalid URL for MetadataServlet: '" + request.getPathInfo() + "'");
            }

            // record or category view, if not a record view, then we will assume a category one
            boolean isRecordView = false;
            if (!doDescribeConnections) {
                isRecordView = (recordFieldDescriptors.get(catalogName).get(viewName) != null);
            }
            if (!ok) {
                logger.info("Cannot get information for asset as requested");
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            } else if (doCategory) {
                boolean isCsharp = (request.getParameter(URL_PARAM_CSHARP) != null);
                if (GET.equals(categoryOperation)) {
                    response.setCharacterEncoding(UTF_8);
                    response.setContentType("application/json;charset=UTF-8");
                    PrintWriter out = response.getWriter();
                    if (categoryPath != null) {
                        DamCategory rootCategory = getBean().findCategories(connections.get(catalogName), categoryPath);
                        JSONObject jsonRoot = makeJsonCategory(rootCategory, isCsharp);
                        String outJson = jsonRoot.toString();
                        out.write(jsonRoot.toString());
                        out.flush();
                        out.close();
                        response.setContentLength(outJson.length());
                        response.setStatus(HttpServletResponse.SC_OK);
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    }
                } else if (CREATE.equals(categoryOperation)) {
                    DamCategory category = null;
                    response.setCharacterEncoding(UTF_8);
                    response.setContentType("application/json;charset=UTF-8");
                    if (categoryPath != null) {
                        category = getBean().createCategoryFromPath(connections.get(catalogName), categoryPath);
                    } else if (categoryId != null) {
                        category = getBean().createSubCategory(connections.get(catalogName), categoryId, categoryName);
                    }
                    if (category != null) {
                        PrintWriter out = response.getWriter();
                        JSONObject jsonObj = makeJsonCategory(category, isCsharp);
                        String outJson = (jsonObj != null) ? jsonObj.toString() : "";
                        out.write(outJson);
                        out.flush();
                        out.close();
                        response.setContentLength(outJson.length());
                        response.setStatus(HttpServletResponse.SC_OK);

                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    }
                } else if (ADD_RECORD.equals(categoryOperation)) {
                    if (addCategoryId < 0) {
                        DamCategory category = getBean().createCategoryFromPath(connections.get(catalogName), categoryPath);
                        addCategoryId = category.id;
                    }
                    getBean().addRecordToCategory(connections.get(catalogName), addCategoryId, addRecordId);
                }
            } else if (doDescribe) {
                if (DamHelperServlet.DEPLOY_MODE_PRODUCTION.equals(deployMode)) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                } else {
                    if (URL_PARAM_JSON.equals(describeOutputFormat)) {
                        doDescribeAsJson(response, catalogName, viewName, isRecordView);
                    } else if (URL_PARAM_CSHARP.equals(describeOutputFormat)) {
                        doDescribeAsCsharp(response, catalogName, viewName, isRecordView);
                    }
                }
            } else if (doDescribeAll) {
                if (DamHelperServlet.DEPLOY_MODE_PRODUCTION.equals(deployMode)) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                } else {
                    if (URL_PARAM_JSON.equals(describeOutputFormat)) {
                        doDescribeAllAsJson(response, catalogName);
                    } else if (URL_PARAM_CSHARP.equals(describeOutputFormat)) {
                        doDescribeAllAsCsharp(response, catalogName);
                    }
                }
            } else if (doDescribeConnections) {
                doDescribeConnectionData(response);
            } else if (getById) {
                DamConnectionInfo connection = connections.get(catalogName);
                boolean isCsharp = (request.getParameter(URL_PARAM_CSHARP) != null);
                Map<String, Map<String, DamFieldDescriptor[]>> fieldDescriptors = (isRecordView) ? recordFieldDescriptors : categoryFieldDescriptors;
                DamFieldDescriptor[] queryFieldDescriptors = fieldDescriptors.get(catalogName).get(viewName);
                if (isRecordView) {
                    DamRecord record = getBean().getRecordById(connection, queryFieldDescriptors, dbId, Locale.getDefault().getDisplayName());
                    if (record != null) {
                        response.setCharacterEncoding(UTF_8);
                        response.setContentType("application/json;charset=UTF-8");
                        PrintWriter out = response.getWriter();
                        HashMap<String, Object> fieldMap = new HashMap<String, Object>();
                        if (!VIEW_IDS.equals(viewName)) {
                            fieldMap.put(FIELD_RECORD_ID, record.id);
                        }
                        if (isCsharp) {
                            // need to replace spaces with "_" for JSON deserialisation in .NET
                            for (int i = 0; i < queryFieldDescriptors.length; i++) {
                                logger.debug("COLIN>>>>> field name: " + queryFieldDescriptors[i].name + " has value '" + getBean().getFieldValue(record.fieldValues[i], false) + "'");
                                fieldMap.put(queryFieldDescriptors[i].name.replaceAll(" ", "_"), getBean().getFieldValue(record.fieldValues[i], true));
                            }
                        } else {
                            for (int i = 0; i < queryFieldDescriptors.length; i++) {
                                logger.debug("COLIN>>>>> field name: " + queryFieldDescriptors[i].name + " has value '" + getBean().getFieldValue(record.fieldValues[i], false) + "'");
                                fieldMap.put(queryFieldDescriptors[i].name, getBean().getFieldValue(record.fieldValues[i], true));
                            }
                        }
                        SimpleEntry[] urls = urlFields.get(catalogName).get(viewName);
                        if (urls != null) {
                            for (int i = 0; i < urls.length; i++) {
                                logger.debug("COLIN>>>>> template url alias: " + urls[i].getKey() + " has value '" + urls[i].getValue());
                                String url = ((String) urls[i].getValue()).replaceFirst(TEMPLATE_PARAM_CATALOG_NAME, String.valueOf(catalogName));
                                url = url.replaceFirst(TEMPLATE_PARAM_ID, String.valueOf(record.id));
                                // you can be sure the key is a string
                                if (isCsharp && ((String) urls[i].getKey()).startsWith("metadata_")) {
                                    // only relevant for metadata urls
                                    url += "?csharp";
                                }
                                if (connection.cloak) {
                                    String cloakKey = Utilities.cloakUrl(url.substring(baseUrlLength));
                                    String cloakedUrl = baseUrl + "/url/" + cloakKey;
                                    logger.info("cloaked url for '" + url.substring(baseUrlLength) + "' is '" + cloakedUrl + "'");
                                    ((HashMap<String, String>) getServletContext().getAttribute(DamHelperServlet.CLOAKED_URLS)).put(cloakKey, url.substring(baseUrlLength));
                                    logger.debug("COLIN>>>>> url alias: " + urls[i].getKey() + " has value '" + url);
                                    fieldMap.put(((String) urls[i].getKey()), cloakedUrl);
                                } else {
                                    fieldMap.put(((String) urls[i].getKey()), url);
                                }
                            }
                        }
                        JSONObject jsonObject = new JSONObject(fieldMap);
                        out.write(jsonObject.toString());
                        out.flush();
                        out.close();
                    } else {
                        logger.info("Cannot find record from URL: '" + request.getPathInfo() + "'");
                    }
                } else {
                    DamCategory category = getBean().getCategoryById(connections.get(catalogName),
                            queryFieldDescriptors, dbId, Locale.getDefault().getDisplayName());
                    if (category != null) {
                        response.setCharacterEncoding(UTF_8);
                        response.setContentType("application/json;charset=UTF-8");
                        PrintWriter out = response.getWriter();
                        HashMap<String, Object> fieldMap = new HashMap<String, Object>();
                        if (!VIEW_IDS.equals(viewName)) {
                            fieldMap.put(FIELD_RECORD_ID, category.id);
                        }
                        if (isCsharp) {
                            // need to replace spaces with "_" for JSON deserialisation in .NET
                            for (int i = 0; i < queryFieldDescriptors.length; i++) {
                                fieldMap.put(queryFieldDescriptors[i].name.replaceAll(" ", "_"), getBean().getFieldValue(category.fieldValues[i], true));
                            }
                        } else {
                            for (int i = 0; i < queryFieldDescriptors.length; i++) {
                                fieldMap.put(queryFieldDescriptors[i].name, getBean().getFieldValue(category.fieldValues[i], true));
                            }
                        }
                        JSONObject jsonObject = new JSONObject(fieldMap);
                        out.write(jsonObject.toString());
                        out.flush();
                        out.close();
                    } else {
                        logger.info("Cannot find category from URL: '" + request.getPathInfo() + "'");
                    }
                }
            } else if (getByQuery) {
                DamConnectionInfo connection = connections.get(catalogName);
                boolean isCsharp = (request.getParameter(URL_PARAM_CSHARP) != null);
                Map<String, Map<String, DamFieldDescriptor[]>> fieldDescriptors = (isRecordView) ? recordFieldDescriptors : categoryFieldDescriptors;
                if (isRecordView) {
                    response.setCharacterEncoding(UTF_8);
                    response.setContentType("application/json;charset=UTF-8");
                    PrintWriter out = response.getWriter();
                    DamFieldDescriptor[] queryFieldDescriptors = fieldDescriptors.get(catalogName).get(viewName);
                    DamRecordCollection recordCollection = null;
                    if (quickSearch) {
                        recordCollection = getBean().findRecordsByQuickSearch(connection, queryFieldDescriptors, quickSearchText, fromIndex, count, Locale.getDefault().getDisplayName());
                    } else {
                        logger.debug("Query is: " + query);
                        recordCollection = getBean().findRecords(connection, queryFieldDescriptors, query, fromIndex, count, Locale.getDefault().getDisplayName());
                    }
                    DamRecord[] records = recordCollection.records;
                    List<JSONObject> jsonRecords = new ArrayList<JSONObject>();
                    if (records != null && records.length > 0) {
                        response.setContentType("application/json;charset=UTF-8");
                        for (DamRecord record : records) {
                            HashMap<String, Object> fieldMap = new HashMap<String, Object>();
                            if (!VIEW_IDS.equals(viewName)) {
                                fieldMap.put(FIELD_RECORD_ID, record.id);
                            }
                            if (isCsharp) {
                                for (int i = 0; i < queryFieldDescriptors.length; i++) {
                                    //logger.debug("COLIN>>>>> field name: " + queryFieldDescriptors[i].name + " has value '" + Utilities.getCumulusFieldValue(record.fieldValues[i], true) + "'");
                                    fieldMap.put(queryFieldDescriptors[i].name.replaceAll(" ", "_"), getBean().getFieldValue(record.fieldValues[i], true));
                                }
                            } else {
                                for (int i = 0; i < queryFieldDescriptors.length; i++) {
                                    //logger.debug("COLIN>>>>> field name: " + queryFieldDescriptors[i].name + " has value '" + Utilities.getCumulusFieldValue(record.fieldValues[i], true) + "'");
                                    fieldMap.put(queryFieldDescriptors[i].name, getBean().getFieldValue(record.fieldValues[i], true));
                                }
                            }
                            SimpleEntry[] urls = urlFields.get(catalogName).get(viewName);
                            if (urls != null) {
                                for (int i = 0; i < urls.length; i++) {
                                    //logger.debug("COLIN>>>>> template url alias: " + urls[i].getKey() + " has value '" + urls[i].getValue());
                                    String url = ((String) urls[i].getValue()).replaceFirst(TEMPLATE_PARAM_CATALOG_NAME, String.valueOf(catalogName));
                                    url = url.replaceFirst(TEMPLATE_PARAM_ID, String.valueOf(record.id));
                                    //logger.debug("COLIN>>>>> url alias: " + urls[i].getKey() + " has value '" + url);
                                    if (connection.cloak) {
                                        String cloakKey = Utilities.cloakUrl(url.substring(baseUrlLength));
                                        String cloakedUrl = baseUrl + "/url/" + cloakKey;
                                        //logger.debug("cloaked url for '" + url.substring(baseUrlLength) + "' is '" + cloakedUrl + "'");
                                        ((HashMap<String, String>) getServletContext().getAttribute(DamHelperServlet.CLOAKED_URLS)).put(cloakKey, url.substring(baseUrlLength));
                                        //logger.debug("COLIN>>>>> url alias: " + urls[i].getKey() + " has value '" + url);
                                        fieldMap.put(((String) urls[i].getKey()), cloakedUrl);
                                    } else {
                                        fieldMap.put(((String) urls[i].getKey()), url);
                                    }
                                }
                            }
                            jsonRecords.add(new JSONObject(fieldMap));
                        }
                    }
                    String outJson = (new JSONArray(jsonRecords)).toString();
                    out.write(outJson);
                    out.flush();
                    out.close();
                    //logger.debug("here is the json: " + outJson);
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentLength(outJson.length());
                }
            } else {
                //TODO implement getByQuery for categories
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            e.printStackTrace();

        } finally {
            response.flushBuffer();
        }
    }

    private void doDescribeAsJson(HttpServletResponse response, String catalogName, String viewName, boolean isRecordView) throws Exception {
        DamFieldDescriptor[] fieldDescriptors = (isRecordView) ? recordFieldDescriptors.get(catalogName).get(viewName) : categoryFieldDescriptors.get(catalogName).get(viewName);
        List<JSONObject> jsonFields = new ArrayList<JSONObject>();
        Map<String, Object> allFields = new HashMap<String, Object>();
        for (DamFieldDescriptor field : fieldDescriptors) {
            HashMap<String, Object> fieldMap = new HashMap<String, Object>();
            fieldMap.put(JSON_FIELD_KEY_NAME, field.name);
            fieldMap.put(JSON_FIELD_KEY_GUID, field.guid);
            fieldMap.put(JSON_FIELD_KEY_DATA_TYPE, field.dataType);
            fieldMap.put(JSON_FIELD_KEY_VALUE_INTERPRETATION, field.valueInterpretation);
            jsonFields.add(new JSONObject(fieldMap));
        }
        allFields.put("fields", new JSONArray(jsonFields));

        // now do the URLs
        String[] fieldUrls = new String[0];
        SimpleEntry[] urls = urlFields.get(catalogName).get(viewName);
        if (urls != null) {
            fieldUrls = new String[urls.length];
            for (int i = 0; i
                    < urls.length; i++) {
                fieldUrls[i] = (String) urls[i].getKey();
            }
        }
        allFields.put("urls", new JSONArray(fieldUrls));
        allFields.put("name", viewName);

        response.setCharacterEncoding(UTF_8);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write((new JSONObject(allFields)).toString());
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().flush();
        response.getWriter().close();
    }

    private void doDescribeAllAsJson(HttpServletResponse response, String catalogName) throws Exception {
        HashMap<String, JSONObject> jsonAllFields = new HashMap<String, JSONObject>();
        HashMap<String, HashMap<String, JSONObject>> allStuff = new HashMap<String, HashMap<String, JSONObject>>();
        // first do the record views
        for (Map.Entry<String, DamFieldDescriptor[]> entries : recordFieldDescriptors.get(catalogName).entrySet()) {
            List<JSONObject> jsonFields = new ArrayList<JSONObject>();
            Map<String, Object> allFields = new HashMap<String, Object>();
            for (DamFieldDescriptor field : entries.getValue()) {
                HashMap<String, Object> fieldMap = new HashMap<String, Object>();
                fieldMap.put(JSON_FIELD_KEY_NAME, field.name);
                fieldMap.put(JSON_FIELD_KEY_GUID, field.guid);
                fieldMap.put(JSON_FIELD_KEY_DATA_TYPE, field.dataType);
                fieldMap.put(JSON_FIELD_KEY_VALUE_INTERPRETATION, field.valueInterpretation);
                jsonFields.add(new JSONObject(fieldMap));
            }

            allFields.put("fields", new JSONArray(jsonFields));
            // now do the URLs
            String[] fieldUrls = new String[0];
            SimpleEntry[] urls = urlFields.get(catalogName).get(entries.getKey());
            if (urls != null) {
                fieldUrls = new String[urls.length];
                for (int i = 0; i
                        < urls.length; i++) {
                    fieldUrls[i] = (String) urls[i].getKey();
                }

            }
            allFields.put("urls", new JSONArray(fieldUrls));
            allFields.put("name", entries.getKey());
            jsonAllFields.put(entries.getKey(), new JSONObject(allFields));
        }
        allStuff.put(RECORD_VIEWS, jsonAllFields);

        // now do the category views
        jsonAllFields = new HashMap<String, JSONObject>();
        for (Map.Entry<String, DamFieldDescriptor[]> entries : categoryFieldDescriptors.get(catalogName).entrySet()) {
            List<JSONObject> jsonFields = new ArrayList<JSONObject>();
            for (DamFieldDescriptor field : entries.getValue()) {
                HashMap<String, Object> fieldMap = new HashMap<String, Object>();
                fieldMap.put(JSON_FIELD_KEY_NAME, field.name);
                fieldMap.put(JSON_FIELD_KEY_GUID, field.guid);
                fieldMap.put(JSON_FIELD_KEY_DATA_TYPE, field.dataType);
                fieldMap.put(JSON_FIELD_KEY_VALUE_INTERPRETATION, field.valueInterpretation);
                jsonFields.add(new JSONObject(fieldMap));
            }

            jsonAllFields.put(entries.getKey(), new JSONObject(jsonFields));
        }

        allStuff.put(CATEGORY_VIEWS, jsonAllFields);

        // now do the category views
        response.setCharacterEncoding(UTF_8);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(new JSONObject(allStuff).toString());
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().flush();
        response.getWriter().close();
    }

    private void doDescribeAsCsharp(HttpServletResponse response, String catalogName, String viewName, boolean isRecordView) throws Exception {
        DamFieldDescriptor[] fieldDescriptors = (isRecordView) ? recordFieldDescriptors.get(catalogName).get(viewName) : categoryFieldDescriptors.get(catalogName).get(viewName);
        PrintWriter printWriter = new PrintWriter(response.getWriter());
        printWriter.println("using Daft.lib;");
        printWriter.println("");
        printWriter.println("namespace Daft.lib.metadata.views");
        printWriter.println("{");
        printWriter.println(makeCsharpClass(viewName, ((isRecordView) ? "RecordView_" : "CategoryView_") + firstUpper(viewName),
                fieldDescriptors, urlFields.get(catalogName).get(viewName)));
        printWriter.println("}");
        response.setCharacterEncoding(UTF_8);
        response.setContentType("text/plain;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void doDescribeAllAsCsharp(HttpServletResponse response, String catalogName) throws Exception {
        PrintWriter printWriter = new PrintWriter(response.getWriter());
        printWriter.println("using Daft.lib;");
        printWriter.println("");
        printWriter.println("namespace Daft.lib.metadata.views");
        printWriter.println("{");
        for (Map.Entry<String, DamFieldDescriptor[]> entries : recordFieldDescriptors.get(catalogName).entrySet()) {
            printWriter.println(makeCsharpClass(entries.getKey(), "RecordView_" + firstUpper(entries.getKey()),
                    entries.getValue(), urlFields.get(catalogName).get(entries.getKey())));
        }

        for (Map.Entry<String, DamFieldDescriptor[]> entries : categoryFieldDescriptors.get(catalogName).entrySet()) {
            printWriter.println(makeCsharpClass(entries.getKey(), "CategoryView_" + firstUpper(entries.getKey()),
                    entries.getValue(), urlFields.get(catalogName).get(entries.getKey())));
        }

        printWriter.println("}");
        response.setCharacterEncoding(UTF_8);
        response.setContentType("text/plain;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private String makeCsharpClass(String viewName, String className, DamFieldDescriptor[] fieldDescriptors, SimpleEntry[] urls) throws Exception {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        printWriter.println("   public class Metadata_" + className + " : CumulusAsset");
        printWriter.println("   {");
        printWriter.println("      public const string VIEW_NAME = \"" + viewName + "\";");
        printWriter.println("");
        for (DamFieldDescriptor field : fieldDescriptors) {
            // ID and Record Name fields are in the CumulusAsset base class, so ignore
            if (FIELD_RECORD_ID.equals(field.name) || FIELD_RECORD_NAME.equals(field.name)) {
                continue;
            }

            String varName = firstLower(field.name).replaceAll(" ", "_");
            String varType = getCsharpType(field);
            printWriter.println("      public " + varType + " " + firstUpper(varName) + " { get; set; }");
            printWriter.println("");
        }

        if (urls != null) {
            for (int i = 0; i
                    < urls.length; i++) {
                printWriter.println("      public string " + firstUpper((String) urls[i].getKey()) + " { get; set; }");
            }

        }
        printWriter.println("   }");
        stringWriter.close();
        printWriter.close();
        return stringWriter.toString();
    }

    private void doDescribeConnectionData(HttpServletResponse response) {
        try {
            List<JSONObject> jsonConnections = new ArrayList<JSONObject>();
            for (Map.Entry<String, DamConnectionInfo> conn : connections.entrySet()) {
                DamConnectionInfo connection = conn.getValue();
                logger.debug("   --- doing connection: " + connection.name);
                HashMap<String, Object> fieldMap = new HashMap<String, Object>();
                fieldMap.put(JSON_FIELD_KEY_NAME, connection.name);
                fieldMap.put(JSON_FIELD_VIEW_NAMES, connection.viewNames);
                jsonConnections.add(new JSONObject(fieldMap));
            }

            // now do the category views
            response.setCharacterEncoding(UTF_8);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(new JSONArray(jsonConnections).toString());
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().flush();
            response.getWriter().close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    //TODO put into Utilities
    public static String firstUpper(String value) {
        String result = value;
        if (Character.isLowerCase(result.charAt(0))) {
            char[] cs = result.toCharArray();
            cs[0] = Character.toUpperCase(cs[0]);
            result = String.valueOf(cs);
        }

        return result;
    }

//TODO put into Utilities
    public static String firstLower(String value) {
        String result = value;
        if (Character.isUpperCase(result.charAt(0))) {
            char[] cs = result.toCharArray();
            cs[0] = Character.toLowerCase(cs[0]);
            result = String.valueOf(cs);
        }
        return result;
    }

    private String getCsharpType(DamFieldDescriptor field) {
        String result = "string";
        switch (field.dataType) {
            case CumulusFieldTypes.FieldTypeString:
                result = "string";
                break;

            case CumulusFieldTypes.FieldTypeBool:
                result = "bool";
                break;

            case CumulusFieldTypes.FieldTypeInteger:
                result = "int";
                break;
            case CumulusFieldTypes.FieldTypeEnum:
                switch (field.valueInterpretation) {
                    case CumulusFieldTypes.VALUE_INTERPRETATION_DEFAULT:
                        result = "CumulusStringEnum";
                        break;
                    case CumulusFieldTypes.VALUE_INTERPRETATION_STRING_ENUM_MULTIPLE_VALUES:
                        result = "CumulusStringEnum[]";
                        break;
                    case CumulusFieldTypes.VALUE_INTERPRETATION_STRING_ENUM_LABEL:
                        result = "CumulusStringEnumLabel";
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        return result;
    }

    private String getJavaType(int dataType) {
        String result = "String";
        switch (dataType) {
            case CumulusFieldTypes.FieldTypeString:
                result = "String";
                break;

            case CumulusFieldTypes.FieldTypeBool:
                result = "boolean";
                break;

            case CumulusFieldTypes.FieldTypeInteger:
                result = "int";
                break;

            default:

                break;
        }

        return result;
    }

    private JSONObject makeJsonCategory(DamCategory category, boolean isCsharp) {
        JSONObject result = null;
        HashMap<String, Object> fieldMap = new HashMap<String, Object>();
        if (isCsharp) {
            // need to replace spaces with "_" for JSON deserialisation in .NET
            fieldMap.put(FIELD_CATEGORY_ID.replaceAll(" ", "_"), category.id);
            fieldMap.put(FIELD_CATEGORY_NAME.replaceAll(" ", "_"), category.name);
        } else {
            fieldMap.put(FIELD_CATEGORY_ID, category.id);
            fieldMap.put(FIELD_CATEGORY_NAME, category.name);
        }
        List<JSONObject> jsonCategories = new ArrayList<JSONObject>();
        for (DamCategory subCategory : category.subCategories) {
            jsonCategories.add(makeJsonCategory(subCategory, isCsharp));
        }
        fieldMap.put(FIELD_CATEGORY_SUBCATEGORIES, new JSONArray(jsonCategories));

        result = new JSONObject(fieldMap);
        return result;
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
        return "Daft.Server Metadata Servlet for Cumulus";
    }
}
