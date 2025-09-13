package com.puneroomie.roomlink.listing.dto;

import com.puneroomie.roomlink.listing.ListingStatus;
import com.puneroomie.roomlink.listing.RoomType;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;

@Value
@Builder
public class ListingResponse {
    Long id;
    String area;
    BigDecimal rent;
    BigDecimal deposit;
    RoomType roomType;
    String description;
    String imageUrl;
    String contactNumber;
    ListingStatus status;
    Double latitude;
    Double longitude;
    Long reporterId;
    Instant createdAt;
}
