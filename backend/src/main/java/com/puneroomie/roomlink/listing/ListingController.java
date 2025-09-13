package com.puneroomie.roomlink.listing;

import com.puneroomie.roomlink.listing.dto.CreateListingRequest;
import com.puneroomie.roomlink.listing.dto.ListingResponse;
import com.puneroomie.roomlink.user.User;
import com.puneroomie.roomlink.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.math.BigDecimal;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/listings")
public class ListingController {
    private final RoomListingRepository listingRepository;
    private final UserRepository userRepository;

    public ListingController(RoomListingRepository listingRepository, UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<ListingResponse> getApproved(
            @RequestParam(value = "area", required = false) String area,
            @RequestParam(value = "minRent", required = false) BigDecimal minRent,
            @RequestParam(value = "maxRent", required = false) BigDecimal maxRent,
            @RequestParam(value = "roomType", required = false) RoomType roomType,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        var pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)));
        return listingRepository.searchApproved(area, minRent, maxRent, roomType, pageable)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getById(@PathVariable Long id) {
        return listingRepository.findById(id)
                .map(l -> ResponseEntity.ok(toResponse(l)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ListingResponse> create(@Valid @RequestBody CreateListingRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        User reporter = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        RoomListing l = RoomListing.builder()
                .area(req.getArea())
                .rent(req.getRent())
                .deposit(req.getDeposit())
                .roomType(req.getRoomType())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .contactNumber(req.getContactNumber())
                .status(ListingStatus.APPROVED)
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .reporter(reporter)
                .build();
        l = listingRepository.save(l);
        return ResponseEntity.created(URI.create("/api/listings/" + l.getId())).body(toResponse(l));
    }

    @GetMapping("/my-listings")
    public List<ListingResponse> myListings(@AuthenticationPrincipal UserDetails principal) {
        User reporter = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return listingRepository.findByReporter(reporter).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ListingResponse toResponse(RoomListing l) {
        return ListingResponse.builder()
                .id(l.getId())
                .area(l.getArea())
                .rent(l.getRent())
                .deposit(l.getDeposit())
                .roomType(l.getRoomType())
                .description(l.getDescription())
                .imageUrl(l.getImageUrl())
                .contactNumber(l.getContactNumber())
                .status(l.getStatus())
                .latitude(l.getLatitude())
                .longitude(l.getLongitude())
                .reporterId(l.getReporter().getId())
                .createdAt(l.getCreatedAt())
                .build();
    }
}
