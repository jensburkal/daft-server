/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.ws.dam.DamAsset;
import com.daftsolutions.lib.ws.dam.DamConnectionInfo;
import com.daftsolutions.lib.ws.dam.DamRecordLock;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import org.json.JSONObject;

/**
 *
 * @author colin
 */
public class AssetServlet extends RESTfulServlet {

    private static Logger logger = Logger.getLogger(AssetServlet.class);
    public final static String ENCODING_UTF_8 = "UTF-8";
    public final static String ASSET_GET = "get";
    public final static String ASSET_CHECKIN = "checkin";
    public final static String ASSET_CHECKOUT = "checkout";
    public final static String ASSET_CANCEL_CHECKOUT = "cancel-checkout";
    public final static String ASSET_LOCK = "lock";
    public final static String ASSET_UNLOCK = "unlock";
    public final static String ASSET_MAKE_VARIANT = "make-variant";
    public final static String USER_DELETE_ASSET = "delete-asset";
    public final static String USER_DELETE_CATEGORY = "delete-category";
    public final static String URL_PARAM_VERSION = "version";
    public final static String URL_PARAM_USER = "user";
    public final static String URL_PARAM_COMMENT = "comment";

    public enum Operations {

        UNKNOWN, DOWNLOAD, CHECKOUT, CHECKIN, CANCEL_CHECKOUT, DELETE_ASSET, DELETE_CATEGORY, LOCK, UNLOCK, MAKE_VARIANT
    };

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        logger.info("AssetServlet init starting ...");
        logger.info("AssetServlet init done.");
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int returnStatus = HttpServletResponse.SC_OK;
        try {
            int id = -1;
            Operations op = Operations.UNKNOWN;
            String catalogName = "";
            String userName = "";
            String comment = "";
            String[] pathElements = getPathElements(request);
            if (pathElements == null) {
                logger.debug("Invalid URL - no path elements");
            } else if (pathElements.length < 4) {
                logger.debug("Invalid URL - too few path elements");
            }
            if (pathElements.length == 4) {
                // catalog name, record id, operation
                catalogName = pathElements[1];
                id = new Integer(pathElements[2]); // let it fail if not a number
                if (ASSET_GET.equals(pathElements[3])) {
                    op = Operations.DOWNLOAD;
                } else if (ASSET_CHECKOUT.equals(pathElements[3])) {
                    op = Operations.CHECKOUT;
                } else if (USER_DELETE_ASSET.equals(pathElements[3])) {
                    op = Operations.DELETE_ASSET;
                } else if (USER_DELETE_CATEGORY.equals(pathElements[3])) {
                    op = Operations.DELETE_CATEGORY;
                } else if (ASSET_LOCK.equals(pathElements[3])) {
                    op = Operations.LOCK;
                } else if (ASSET_UNLOCK.equals(pathElements[3])) {
                    op = Operations.UNLOCK;
                }
            }

            ServletConfig servletConfig = getServletConfig();
            DamConnectionInfo connection = connections.get(catalogName);
            switch (op) {
                case DOWNLOAD:
                    Integer version = null;
                    try {
                        version = new Integer(servletConfig.getInitParameter(URL_PARAM_VERSION));
                    } catch (Exception ne) {
                        // no version or invalid version, just ignore
                    }
                    DamAsset asset = null;
                    if (version != null) {
                        asset = doDownloadVersion(connection, id, version, userName);
                    } else {
                        asset = doDownload(connection, id, userName);
                    }
                    response.setContentType(getMimeType(asset));
                    response.setContentLength(asset.data.length);
                    response.getOutputStream().write(asset.data);
                    break;
                case CHECKOUT:
                    break;
                case DELETE_ASSET:
                    doDeleteAsset(connection, id);
                    //returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    break;
                case DELETE_CATEGORY:
                    doDeleteCategory(connection, id);
                    //returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    break;
                case LOCK:
                    userName = request.getParameter(URL_PARAM_USER);
                    comment = request.getParameter(URL_PARAM_COMMENT);
                    if (comment == null) {
                        comment = "";
                    }
                    DamRecordLock lock = doLockAsset(connection, id, userName, comment, true);
                    if (!lock.isLocked()) {
                        returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    } else {
                        response.setCharacterEncoding(UTF_8);
                        response.setContentType("application/json;charset=UTF-8");
                        PrintWriter out = response.getWriter();
                        if (lock != null) {
                            String outJson = new JSONObject(lock).toString();
                            out.write(outJson);
                            out.flush();
                            out.close();
                            response.setContentLength(outJson.length());
                        }
                    }
                    break;
                case UNLOCK:
                    userName = request.getParameter(URL_PARAM_USER);
                    comment = request.getParameter(URL_PARAM_COMMENT);
                    if (comment == null) {
                        comment = "";
                    }
                    lock = doUnlockAsset(connection, id, userName, comment, true);
                    if (lock.isLocked()) {
                        returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    } else {
                        response.setCharacterEncoding(UTF_8);
                        response.setContentType("application/json;charset=UTF-8");
                        PrintWriter out = response.getWriter();
                        if (lock != null) {
                            String outJson = new JSONObject(lock).toString();
                            out.write(outJson);
                            out.flush();
                            out.close();
                            response.setContentLength(outJson.length());
                        }
                    }
                    break;
                case MAKE_VARIANT:
                    break;
                default:
                    returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    break;
            }
        } catch (Exception e) {
            logger.debug("Error in AssetServlet: " + e.getMessage());
            //e.printStackTrace();
            returnStatus = HttpServletResponse.SC_NOT_FOUND;
        } finally {
            //logger.debug("preview return status: " + returnStatus);
            if (returnStatus != HttpServletResponse.SC_OK) {
                response.sendError(returnStatus);
            }
            response.getOutputStream().flush();
            response.getOutputStream().close();
            response.setStatus(returnStatus);
        }
    }

    /**
     * for now just return same for all
     * TODO base the mime time on information form Cumulus
     * @param asset
     * @return
     */
    private String getMimeType(DamAsset asset) {
        return "application/octet-stream";
    }

    /**
     *
     * @param connection
     * @param id
     * @return
     * @throws Exception
     */
    private DamAsset doDownload(DamConnectionInfo connection, int id, String userName) throws Exception {
        DamAsset result = new DamAsset();
        result = getBean().downloadAsset(connection, id);
        return result;
    }

    /**
     *
     * @param connection
     * @param id
     * @return
     * @throws Exception
     */
    private DamAsset doDownloadVersion(DamConnectionInfo connection, int id, int version, String userName) throws Exception {
        DamAsset result = new DamAsset();
        //result = getBean().downloadAsset(connection, id, version);
        return result;
    }

    /**
     *
     * @param connection
     * @param id
     * @param version
     * @return
     * @throws Exception
     */
    private DamAsset doCheckout(DamConnectionInfo connection, int id, int version, boolean getData) throws Exception {
        DamAsset result = new DamAsset();
        //result = getBean().checkoutAsset(connection, id, version, getData);
        return result;
    }

    /*
    variants - AssetXRefFieldValue
    Item.checkout
     */
    public int[] getAssetVersions(DamConnectionInfo connection, int id) {
        int[] result = new int[0];
        return result;
    }

    /**
     * @param connection
     * @param id
     * @param userName 
     * @throws Exception
     */
    private DamRecordLock doLockAsset(DamConnectionInfo connection, int id, String userName, String comment, boolean doLog) throws Exception {
        return getBean().lockAsset(connection, id, userName, comment, doLog);
    }

    /**
     * @param connection
     * @param id
     * @param userName
     * @throws Exception
     */
    private DamRecordLock doUnlockAsset(DamConnectionInfo connection, int id, String userName, String comment, boolean doLog) throws Exception {
        return getBean().unlockAsset(connection, id, userName, comment, doLog);
    }

    /**
     * 
     * @param connection
     * @param id
     * @throws Exception
     */
    private void doDeleteAsset(DamConnectionInfo connection, int id) throws Exception {
        getBean().deleteAsset(connection, id);
    }

    /**
     *
     * @param connection
     * @param id
     * @throws Exception
     */
    private void doDeleteCategory(DamConnectionInfo connection, int id) throws Exception {
        getBean().deleteCategory(connection, id);
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
        return "Daft.Server Asset Servlet";
    }
}
