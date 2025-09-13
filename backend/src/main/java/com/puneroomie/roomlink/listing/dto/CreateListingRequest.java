package com.puneroomie.roomlink.listing.dto;

import com.puneroomie.roomlink.listing.RoomType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateListingRequest {
    @NotBlank
    private String area;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal rent;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal deposit;

    @NotNull
    private RoomType roomType;

    private String description;

    private String imageUrl; // for prototype; in real, handle upload separately

    @NotBlank
    @Pattern(regexp = "^\\d{8,12}$", message = "Enter valid phone number (8-12 digits)")
    private String contactNumber;

    private Double latitude;
    private Double longitude;
}
