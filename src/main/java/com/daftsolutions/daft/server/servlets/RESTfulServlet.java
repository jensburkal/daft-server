/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.previewcache.PreviewCacheManager;
import com.daftsolutions.lib.utils.SimpleEntry;
import com.daftsolutions.lib.ws.beans.DamBean;
import com.daftsolutions.lib.ws.dam.DamConnectionInfo;
import com.daftsolutions.lib.ws.dam.DamFieldDescriptor;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Colin Manning
 */
public abstract class RESTfulServlet extends HttpServlet {

    public final static String FIELD_RECORD_ID = "ID";
    public final static String FIELD_RECORD_NAME = "Record Name";
    public final static String FIELD_CATEGORY_ID = "ID";
    public final static String FIELD_CATEGORY_NAME = "Category Name";
    public final static String FIELD_CATEGORY_SUBCATEGORIES = "SubCategories";
    protected String baseUrl = null;
    protected int baseUrlLength = 0;
    protected String previewMapping = null;
    protected String metadataMapping = null;
    protected HashMap<String, DamConnectionInfo> connections = null;
    protected HashMap<String, Map<String, DamFieldDescriptor[]>> recordFieldDescriptors = new HashMap<String, Map<String, DamFieldDescriptor[]>>();
    protected HashMap<String, Map<String, DamFieldDescriptor[]>> categoryFieldDescriptors = new HashMap<String, Map<String, DamFieldDescriptor[]>>();
    protected HashMap<String, Map<String, SimpleEntry[]>> urlFields = new HashMap<String, Map<String, SimpleEntry[]>>();
    protected PreviewCacheManager previewCacheManager = null;
    protected String deployMode = DamHelperServlet.DEFAULT_DEPLOY_MODE;

    @Override
    public void init() {
        baseUrl = (String) getServletContext().getAttribute(DamHelperServlet.BASE_URL);
        baseUrlLength = baseUrl.length();
        previewMapping = (String) getServletContext().getAttribute(DamHelperServlet.PREVIEW_MAPPING);
        metadataMapping = (String) getServletContext().getAttribute(DamHelperServlet.METADATA_MAPPING);
        connections = (HashMap<String, DamConnectionInfo>) getServletContext().getAttribute(DamHelperServlet.DAM_CONNECTIONS);
        recordFieldDescriptors = (HashMap<String, Map<String, DamFieldDescriptor[]>>) getServletContext().getAttribute(com.daftsolutions.daft.server.servlets.DamHelperServlet.DAM_RECORD_FIELD_DESCRIPTORS);
        categoryFieldDescriptors = (HashMap<String, Map<String, DamFieldDescriptor[]>>) getServletContext().getAttribute(com.daftsolutions.daft.server.servlets.DamHelperServlet.DAM_CATEGORY_FIELD_DESCRIPTORS);
        urlFields = (HashMap<String, Map<String, SimpleEntry[]>>) getServletContext().getAttribute(DamHelperServlet.DAM_URL_FIELDS);
        previewCacheManager = new PreviewCacheManager((File) getServletContext().getAttribute(DamHelperServlet.CACHE_DIR));
        deployMode = (String) getServletContext().getAttribute(DamHelperServlet.PARAM_DEPLOY_MODE);
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
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
    }

    /**
     * Returns a short description of the servlet.
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "RESTServlet";
    }// </editor-fold>

    protected DamBean getBean() {
        return (DamBean) getServletContext().getAttribute(com.daftsolutions.daft.server.servlets.DamHelperServlet.DAM_BEAN);
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
}
