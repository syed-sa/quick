package com.justsearch.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "favorites",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "service_id"})
)
public class FavoriteService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Services service;

    public FavoriteService() {}

    public FavoriteService(User user, Services service) {
        this.user = user;
        this.service = service;
    }

    public long getId() { return id; }
    public User getUser() { return user; }
    public Services getService() { return service; }
}
