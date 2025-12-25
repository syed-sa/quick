package com.justsearch.backend.seeder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.opencsv.CSVReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;

import com.justsearch.backend.model.*;
import com.justsearch.backend.repository.UserRepository;
import com.justsearch.backend.repository.CategoryRepository;
import com.justsearch.backend.repository.ServicesRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private CategoryRepository categoryRepo;
    @Autowired
    private ServicesRepository serviceRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional // <- ensures all-or-nothing
    public void run(String... args) throws Exception {
        seedUsers();
        seedCategories();
        seedServices();
    }

    private void seedUsers() throws Exception {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("data/users.csv");
                CSVReader reader = new CSVReader(new InputStreamReader(is))) {

            String[] line;
            reader.readNext(); // skip header
            while ((line = reader.readNext()) != null) {
                // Skip if user already exists
                if (userRepo.findByEmail(line[1]).isPresent())
                    continue;

                User u = new User();
                u.setName(line[0]);
                u.setEmail(line[1]);
                u.setPhone(line[2]);
                u.setPassword(passwordEncoder.encode(line[3]));
                userRepo.save(u);
            }
        }
        System.out.println("Users Seeded");
    }

    private void seedCategories() throws Exception {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("data/categories.csv");
                CSVReader reader = new CSVReader(new InputStreamReader(is))) {

            String[] line;
            reader.readNext(); // skip header
            while ((line = reader.readNext()) != null) {
                if (categoryRepo.findByName(line[0]).isPresent())
                    continue;

                BuisnessCategory c = new BuisnessCategory();
                c.setName(line[0]);
                c.setKeywords(Arrays.asList(line[1].split(",")));
                categoryRepo.save(c);
            }
        }
        System.out.println("Categories Seeded");
    }

    private void seedServices() throws Exception {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("data/services.csv");
                CSVReader reader = new CSVReader(new InputStreamReader(is))) {

            String[] line;
            reader.readNext(); // skip header
            while ((line = reader.readNext()) != null) {
                final String[] currentLine = line;

                User provider = userRepo.findByEmail(currentLine[0])
                        .orElseThrow(() -> new RuntimeException("Provider not found: " + currentLine[0]));

                BuisnessCategory category = categoryRepo.findByName(currentLine[3])
                        .orElseThrow(() -> new RuntimeException("Category not found: " + currentLine[3]));


                Services s = new Services();
                s.setServiceProvider(provider);
                s.setCompanyName(currentLine[1]);
                s.setCity(currentLine[2]);
                s.setBusinessCategory(category);
                s.setPhone(currentLine[4]);
                s.setEmail(currentLine[5]);
                s.setAddress(currentLine[6]);
                s.setPostalCode(currentLine[7]);
                s.setKeywords(Arrays.asList(currentLine[8].split(",")));

                serviceRepo.save(s);
            }
        }
        System.out.println("Services Seeded");
    }
}
