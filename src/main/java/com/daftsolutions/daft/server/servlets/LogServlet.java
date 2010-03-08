/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.daftsolutions.daft.server.servlets;

import com.daftsolutions.lib.log.EventLogger;
import java.io.IOException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;

/**
 *
 * @author colin
 */
public class LogServlet extends RESTfulServlet {

    private static Logger logger = Logger.getLogger(LogServlet.class);
    public final static String ENCODING_UTF_8 = "UTF-8";
    public final static String LOG_LOG = "log";
    public final static String URL_PARAM_MESSAGE = "message";
    public final static String URL_PARAM_STATUS = "status";
    public final static String URL_PARAM_USER = "user";
    public final static String URL_PARAM_COMMENT = "comment";
    public final static String STATUS_SUCCESS = "success";
    public final static String STATUS_FAILURE = "failure";
    public final static String STATUS_WARNING = "warning";
    public final static String STATUS_UNKNOWN = "unknown";

    public enum Operations {

        UNKNOWN, LOG
    };
    private EventLogger eventLogger = null;
    private EventLogger.StatusValues eventStatus = EventLogger.StatusValues.UNKNOWN;

    /**
     *
     * @param config
     * @throws javax.servlet.ServletException
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        logger.info("LogServlet init starting ...");
        eventLogger = new EventLogger();
        logger.info("LogServlet init done.");
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
            String[] pathElements = getPathElements(request);
            if (pathElements == null) {
                logger.debug("Invalid URL - no path elements");
            } else if (pathElements.length < 3) {
                logger.debug("Invalid URL - too few path elements");
            }
            if (pathElements.length == 3) {
                // catalog name, record id, operation
                catalogName = pathElements[1];
                if (LOG_LOG.equals(pathElements[2])) {
                    op = Operations.LOG;
                }
            } else if (pathElements.length == 4) {
                // /log/sample/colin/id/log?message=Hello
                catalogName = pathElements[1];
                id = new Integer(pathElements[2]); // let it fail if not a number
                if (LOG_LOG.equals(pathElements[3])) {
                    op = Operations.LOG;
                }
            }

            ServletConfig servletConfig = getServletConfig();
            switch (op) {
                case LOG:
                    String message = request.getParameter(URL_PARAM_MESSAGE);
                    String status = request.getParameter(URL_PARAM_STATUS);
                    String userName = request.getParameter(URL_PARAM_USER);
                    if (userName == null) {
                        userName = "";
                    }
                    String comment = request.getParameter(URL_PARAM_COMMENT);
                    if (comment == null) {
                        comment = "";
                    }
                    try {
                        eventStatus = Enum.valueOf(EventLogger.StatusValues.class, status.toUpperCase());
                    } catch (Exception se) {
                        logger.debug("problem setting status: " + status + " default to: " + eventStatus);
                        se.printStackTrace();
                    }
                    eventLogger.log(eventStatus, catalogName, id, userName, message, comment);
                    break;
                default:
                    returnStatus = HttpServletResponse.SC_FORBIDDEN;
                    break;
            }
        } catch (Exception e) {
            logger.debug("Error in LogServlet: " + e.getMessage());
            e.printStackTrace();
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
        return "Daft.Server Log Servlet";
    }
}
