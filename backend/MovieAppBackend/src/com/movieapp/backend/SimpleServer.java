package com.movieapp.backend;

import fi.iki.elonen.NanoHTTPD;

import java.io.IOException;
import java.util.*;
import java.sql.*;

public class SimpleServer extends NanoHTTPD {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/movie_app";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "Gmssy@sql001";

    public SimpleServer() throws IOException {
        super(8080);
        start(SOCKET_READ_TIMEOUT, false);
        System.out.println("Server started on http://localhost:8080");
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        Method method = session.getMethod();

        if (Method.OPTIONS.equals(method)) {
            Response response = newFixedLengthResponse(Response.Status.OK, MIME_PLAINTEXT, "OK");
            addCORSHeaders(response);
            return response;
        }

        try {
            if (method == Method.GET && uri.equals("/api/hello")) {
                Response response = newFixedLengthResponse(Response.Status.OK, MIME_PLAINTEXT, "Hello from Java backend!");
                addCORSHeaders(response);
                return response;
            }

            if (method == Method.POST && uri.equals("/api/add-favorite")) {
                return handleAddToDB(session, "favorites");
            } else if (method == Method.POST && uri.equals("/api/remove-favorite")) {
                return handleRemoveFromDB(session, "favorites");
            } else if (method == Method.GET && uri.equals("/api/list-favorites")) {
                return handleListFromDB("favorites");
            } else if (method == Method.POST && uri.equals("/api/add-watchlist")) {
                return handleAddToDB(session, "watchlist");
            } else if (method == Method.POST && uri.equals("/api/remove-watchlist")) {
                return handleRemoveFromDB(session, "watchlist");
            } else if (method == Method.GET && uri.equals("/api/list-watchlist")) {
                return handleListFromDB("watchlist");
            }

        } catch (Exception e) {
            e.printStackTrace();
            Response error = newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Error: " + e.getMessage());
            addCORSHeaders(error);
            return error;
        }

        Response notFound = newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Not Found");
        addCORSHeaders(notFound);
        return notFound;
    }

    // Parse POST body parameters and insert into DB
    private synchronized Response handleAddToDB(IHTTPSession session, String table) throws Exception {
        Map<String, String> params = parsePostBody(session);

        // Required fields check
        if (!params.containsKey("media_id") || !params.containsKey("media_type") ||
            !params.containsKey("title") || !params.containsKey("poster_path")) {
            return errorResponse("Missing one or more required fields.");
        }

        long mediaId;
        try {
            mediaId = Long.parseLong(params.get("media_id"));
        } catch (NumberFormatException e) {
            return errorResponse("Invalid media_id format.");
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
            // Check if already exists to avoid duplicates
            String checkSql = "SELECT COUNT(*) FROM " + table + " WHERE media_id = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setLong(1, mediaId);
                ResultSet rs = checkStmt.executeQuery();
                if (rs.next() && rs.getInt(1) > 0) {
                    Response resp = newFixedLengthResponse(table + " item already exists.");
                    addCORSHeaders(resp);
                    return resp;
                }
            }

            String sql = "INSERT INTO " + table + " (media_id, media_type, title, poster_path) VALUES (?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setLong(1, mediaId);
                stmt.setString(2, params.get("media_type"));
                stmt.setString(3, params.get("title"));
                stmt.setString(4, params.get("poster_path"));
                stmt.executeUpdate();
            }
        }

        Response response = newFixedLengthResponse(table + " item added!");
        addCORSHeaders(response);
        return response;
    }

    // Parse POST body parameters and remove from DB by media_id
    private synchronized Response handleRemoveFromDB(IHTTPSession session, String table) throws Exception {
        Map<String, String> params = parsePostBody(session);

        if (!params.containsKey("media_id")) {
            return errorResponse("Missing media_id for deletion.");
        }

        long mediaId;
        try {
            mediaId = Long.parseLong(params.get("media_id"));
        } catch (NumberFormatException e) {
            return errorResponse("Invalid media_id format.");
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
            String sql = "DELETE FROM " + table + " WHERE media_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setLong(1, mediaId);
                int affectedRows = stmt.executeUpdate();
                if (affectedRows == 0) {
                    return errorResponse("Item not found in " + table + ".");
                }
            }
        }

        Response response = newFixedLengthResponse(table + " item removed!");
        addCORSHeaders(response);
        return response;
    }

    // List all items from the specified table and return JSON
    private synchronized Response handleListFromDB(String table) throws Exception {
        List<Map<String, String>> list = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS)) {
            String sql = "SELECT media_id, media_type, title, poster_path FROM " + table;
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                ResultSet rs = stmt.executeQuery();

                while (rs.next()) {
                    Map<String, String> item = new HashMap<>();
                    item.put("mediaId", rs.getString("media_id"));    // camelCase for frontend
                    item.put("mediaType", rs.getString("media_type"));
                    item.put("title", rs.getString("title"));
                    item.put("poster_path", rs.getString("poster_path"));
                    list.add(item);
                }
            }
        }

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            json.append(mapToJson(list.get(i)));
            if (i < list.size() - 1) json.append(",");
        }
        json.append("]");

        Response response = newFixedLengthResponse(Response.Status.OK, "application/json", json.toString());
        addCORSHeaders(response);
        return response;
    }

    // Parse POST body parameters robustly for form-urlencoded or multipart
    private Map<String, String> parsePostBody(IHTTPSession session) throws IOException, NanoHTTPD.ResponseException {
        Map<String, String> files = new HashMap<>();
        session.parseBody(files); // Parses and populates params and files

        // Return params map (key-value from form or query)
        return session.getParms();
    }

    // Helper to convert Map to JSON string
    private String mapToJson(Map<String, String> map) {
        StringBuilder sb = new StringBuilder("{");
        int count = 0;
        for (Map.Entry<String, String> entry : map.entrySet()) {
            sb.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue().replace("\"", "\\\"")).append("\"");
            if (++count < map.size()) sb.append(",");
        }
        sb.append("}");
        return sb.toString();
    }

    private void addCORSHeaders(Response response) {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
    }

    private Response errorResponse(String message) {
        Response response = newFixedLengthResponse(Response.Status.BAD_REQUEST, MIME_PLAINTEXT, message);
        addCORSHeaders(response);
        return response;
    }

    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            new SimpleServer();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
