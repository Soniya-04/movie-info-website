package com.movieapp.backend;

import com.movieapp.backend.models.FavoriteItem;

import java.util.List;

public class Main {
    public static void main(String[] args) {

        // ----- FAVORITE SERVICE -----
        FavoriteService favoriteService = new FavoriteService();

        // Add to favorites
        favoriteService.addFavorite(101, "movie", "The Matrix", "/matrix.jpg");

        // List favorites
        System.out.println("Favorites:");
        List<FavoriteItem> favorites = favoriteService.listFavorites();
        for (FavoriteItem fav : favorites) {
            System.out.println("- " + fav.getTitle() + " (" + fav.getMediaType() + ")");
        }

        // Remove from favorites
        favoriteService.removeFavorite(101);

        // ----- WATCHLIST SERVICE -----
        WatchlistService watchlistService = new WatchlistService();

        // Add to watchlist
        watchlistService.addToWatchlist(202, "tv", "Breaking Bad", "/breakingbad.jpg");

        // List watchlist
        System.out.println("\nWatchlist:");
        List<FavoriteItem> watchlist = watchlistService.listWatchlist();
        for (FavoriteItem item : watchlist) {
            System.out.println("- " + item.getTitle() + " (" + item.getMediaType() + ")");
        }

        // Remove from watchlist
        watchlistService.removeFromWatchlist(202, "tv");
    }
}
