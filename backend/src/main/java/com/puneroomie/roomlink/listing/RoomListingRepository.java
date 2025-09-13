package com.puneroomie.roomlink.listing;

import com.puneroomie.roomlink.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface RoomListingRepository extends JpaRepository<RoomListing, Long> {
    List<RoomListing> findByStatus(ListingStatus status);

    List<RoomListing> findByReporter(User reporter);

    @Query("SELECT l FROM RoomListing l WHERE l.status = 'APPROVED' " +
            "AND (:area IS NULL OR LOWER(l.area) LIKE LOWER(CONCAT('%', :area, '%'))) " +
            "AND (:roomType IS NULL OR l.roomType = :roomType) " +
            "AND (:minRent IS NULL OR l.rent >= :minRent) " +
            "AND (:maxRent IS NULL OR l.rent <= :maxRent)")
    Page<RoomListing> searchApproved(@Param("area") String area,
            @Param("minRent") BigDecimal minRent,
            @Param("maxRent") BigDecimal maxRent,
            @Param("roomType") RoomType roomType,
            Pageable pageable);
}
