package com.movieapp.backend;

import com.movieapp.backend.models.FavoriteItem;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class WatchlistService {

    public boolean addToWatchlist(long mediaId, String mediaType, String title, String posterPath) {
        String sql = "INSERT INTO watchlist (media_id, media_type, title, poster_path) VALUES (?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, mediaId);
            stmt.setString(2, mediaType);
            stmt.setString(3, title);
            stmt.setString(4, posterPath);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error adding to watchlist: " + e.getMessage());
            return false;
        }
    }

    public boolean removeFromWatchlist(long mediaId, String mediaType) {
        String sql = "DELETE FROM watchlist WHERE media_id = ? AND media_type = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, mediaId);
            stmt.setString(2, mediaType);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error removing from watchlist: " + e.getMessage());
            return false;
        }
    }

    public List<FavoriteItem> listWatchlist() {
        List<FavoriteItem> watchlist = new ArrayList<>();
        String sql = "SELECT * FROM watchlist";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                long mediaId = rs.getLong("media_id");
                String mediaType = rs.getString("media_type");
                String title = rs.getString("title");
                String posterPath = rs.getString("poster_path");

                watchlist.add(new FavoriteItem(mediaId, mediaType, title, posterPath));
            }

        } catch (SQLException e) {
            System.err.println("Error listing watchlist: " + e.getMessage());
        }

        return watchlist;
    }
}
