
package com.justsearch.backend.dto;
public class RoleDto {
    public RoleDto(String name, long id) {
        this.name = name;
        this.id = id;
    }

    private long id;

    private String name;

    private String description;

    public String getName()
    {
        return name;
    }
    public long getId() {
        return id;
    }
    public String getDescription() {
        return description;
    }

}