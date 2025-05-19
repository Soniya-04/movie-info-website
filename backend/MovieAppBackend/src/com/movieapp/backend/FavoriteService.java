package com.movieapp.backend;

import com.movieapp.backend.models.FavoriteItem;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FavoriteService {

    public boolean addFavorite(long mediaId, String mediaType, String title, String posterPath) {
        String sql = "INSERT INTO favorites (media_id, media_type, title, poster_path) VALUES (?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, mediaId);
            stmt.setString(2, mediaType);
            stmt.setString(3, title);
            stmt.setString(4, posterPath);
            stmt.executeUpdate();
            System.out.println("✅ Favorite added.");
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean removeFavorite(long mediaId) {
        String sql = "DELETE FROM favorites WHERE media_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, mediaId);
            int rows = stmt.executeUpdate();
            System.out.println("🗑 Favorite removed.");
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<FavoriteItem> listFavorites() {
        List<FavoriteItem> favorites = new ArrayList<>();
        String sql = "SELECT * FROM favorites";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                FavoriteItem item = new FavoriteItem();
                item.setMediaId(rs.getLong("media_id"));
                item.setMediaType(rs.getString("media_type"));
                item.setTitle(rs.getString("title"));
                item.setPosterPath(rs.getString("poster_path"));

                favorites.add(item);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return favorites;
    }
}
