/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.ws.dam.DamConnectionInfo;
import com.daftsolutions.lib.ws.dam.DamUser;
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
public class BozoServlet extends RESTfulServlet {

    private static Logger logger = Logger.getLogger(BozoServlet.class);
    public final static String ENCODING_UTF_8 = "UTF-8";
    public final static String USER_FLOWER = "flower";
    public final static String URL_PARAM_USERNAME = "s";
    public final static String URL_PARAM_PASSWORD = "g";

    public enum Operations {

        UNKNOWN, FLOWER
    };

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        logger.info("BozoServlet init starting ...");
        logger.info("BozoServlet init done.");
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
            int recordId = -1;
            Operations op = Operations.UNKNOWN;
            String catalogName = "";
            String[] pathElements = getPathElements(request);
            if (pathElements == null) {
                logger.debug("Invalid URL - no path elements");
            } else if (pathElements.length < 4) {
                logger.debug("Invalid URL - too few path elements");
            }
            if (pathElements.length == 4) {
                // catalog name, record id, operation
                catalogName = pathElements[1];
                recordId = new Integer(pathElements[2]); // let it fail if not a number
                if (USER_FLOWER.equals(pathElements[3])) {
                    op = Operations.FLOWER;
                }
            }
            DamConnectionInfo connection = connections.get(catalogName);
            switch (op) {
                case FLOWER:
                    DamConnectionInfo testConnection = new DamConnectionInfo();
                    testConnection.host = connection.host;
                    testConnection.catalogName = connection.catalogName;
                    testConnection.username = request.getParameter(URL_PARAM_USERNAME);
                    testConnection.password = request.getParameter(URL_PARAM_PASSWORD);
                    DamUser user = doUser(connection, testConnection);
                    if (user != null) {
                        response.setCharacterEncoding(MetadataServlet.UTF_8);
                        response.setContentType("application/json;charset=UTF-8");
                        PrintWriter out = response.getWriter();
                        out.write(new JSONObject(user).toString());
                        out.flush();
                        out.close();
                        response.setStatus(HttpServletResponse.SC_OK);
                    } else {
                        returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    }
                    if (returnStatus != HttpServletResponse.SC_OK) {
                        response.sendError(returnStatus);
                    }
                    response.setStatus(returnStatus);
                    break;
                default:
                    returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    break;
            }
        } catch (Exception e) {
           // e.printStackTrace();
            returnStatus = HttpServletResponse.SC_NOT_FOUND;
        } finally {
                    response.setStatus(returnStatus);
       }
    }

    private DamUser doUser(DamConnectionInfo connection, DamConnectionInfo testConnection) {
        return getBean().getUser(connection, testConnection);
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
        return "Daft.Server Bozo Servlet";
    }
}
