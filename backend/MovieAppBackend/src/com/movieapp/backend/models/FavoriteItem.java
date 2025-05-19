package com.movieapp.backend.models;

public class FavoriteItem {
    private long mediaId;
    private String mediaType;
    private String title;
    private String posterPath;

    public FavoriteItem() {}

    public FavoriteItem(long mediaId, String mediaType, String title, String posterPath) {
        this.mediaId = mediaId;
        this.mediaType = mediaType;
        this.title = title;
        this.posterPath = posterPath;
    }

    public long getMediaId() {
        return mediaId;
    }

    public void setMediaId(long mediaId) {
        this.mediaId = mediaId;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }
}
