/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import java.io.IOException;
import java.util.HashMap;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;

/**
 *
 * @author colin
 */
public class UrlServlet extends RESTfulServlet {

    private static Logger logger = Logger.getLogger(AssetServlet.class);
    public final static String ENCODING_UTF_8 = "UTF-8";
    // for initial testing, just a hard coded map

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        logger.info("UrlServlet init starting ...");
        logger.info("UrlServlet init done.");
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
        String urlKey = null;
        String redirectUrl = null;
        boolean ok = false;
        try {
            String[] pathElements = getPathElements(request);
            if (pathElements == null) {
                logger.debug("Invalid URL - no path elements");
            } else if (pathElements.length < 2) {
                logger.debug("Invalid URL - too few path elements");
            } else if (pathElements.length == 2) {
                // redirectUrl
                urlKey = pathElements[1];
                ok = true;
            }

            if (ok) {
                // redirectUrl = urls.get(urlKey);
                redirectUrl = ((HashMap<String, String>) getServletContext().getAttribute(DamHelperServlet.CLOAKED_URLS)).get(urlKey);
                if (redirectUrl != null) {
                    //response.sendRedirect(redirectUrl);
                    RequestDispatcher rd = getServletContext().getRequestDispatcher(redirectUrl);
                    rd.forward(request, response);
                    returnStatus = HttpServletResponse.SC_OK;
                } else {
                    returnStatus = HttpServletResponse.SC_NOT_FOUND;
                }
            }
        } catch (Exception e) {
            // e.printStackTrace();
            returnStatus = HttpServletResponse.SC_NOT_FOUND;
        } finally {
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
        return "Daft.Server Url Servlet";
    }
}
