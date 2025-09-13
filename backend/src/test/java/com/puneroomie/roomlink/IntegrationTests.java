package com.puneroomie.roomlink;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.puneroomie.roomlink.listing.RoomType;
import com.puneroomie.roomlink.listing.dto.CreateListingRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class IntegrationTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    void authAndListingFlow() throws Exception {
        // register
        String token = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\",\"password\":\"secret\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String jwt = objectMapper.readTree(token).get("token").asText();

        // create listing
        CreateListingRequest req = new CreateListingRequest();
        req.setArea("Kothrud");
        req.setRent(new BigDecimal("8000"));
        req.setDeposit(new BigDecimal("20000"));
        req.setRoomType(RoomType.ROOM_1RK);
        req.setDescription("Nice place");
        req.setContactNumber("9876543210");

        mockMvc.perform(post("/api/listings")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // get list
        mockMvc.perform(get("/api/listings"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}
