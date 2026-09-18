package com.tourister.service;

import com.tourister.entity.Place;
import com.tourister.entity.TourPackage;
import com.tourister.entity.User;
import com.tourister.entity.enums.PlaceCategory;
import com.tourister.entity.enums.Role;
import com.tourister.repository.PlaceRepository;
import com.tourister.repository.TourPackageRepository;
import com.tourister.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;

@Service
public class DataInitializerService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TourPackageRepository packageRepository;
    private final PlaceRepository placeRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.initial-admin.email:admin@tourister.com}")
    private String adminEmail;

    @Value("${app.initial-admin.password:Admin@12345}")
    private String adminPassword;

    @Value("${app.initial-admin.fullName:System Administrator}")
    private String adminName;

    @Value("${app.initial-admin.phone:+1-800-555-0199}")
    private String adminPhone;

    public DataInitializerService(UserRepository userRepository,
                                  TourPackageRepository packageRepository,
                                  PlaceRepository placeRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.packageRepository = packageRepository;
        this.placeRepository = placeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedTourPackages();
        seedPlaces();
    }

    private void seedAdminUser() {
        if (userRepository.countByRole(Role.ROLE_ADMIN) == 0 && !userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail);
            admin.setPhone(adminPhone);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println(">>> Initial Admin user created: " + adminEmail);
        }
    }

    private void seedTourPackages() {
        if (packageRepository.count() == 0) {
            // Package 1: Swiss Alps & European Delights
            TourPackage p1 = new TourPackage();
            p1.setName("Swiss Alps & European Delights");
            p1.setDestination("Zurich, Interlaken & Lucerne, Switzerland");
            p1.setDescription("Experience breathtaking Alpine landscapes, pristine crystal-clear lakes, scenic train routes, and historic Swiss villages on this unforgettable 7-day tour.");
            p1.setImageUrl("https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80");
            p1.setDurationDays(7);
            p1.setPrice(new BigDecimal("1899.00"));
            p1.setAccommodation("4-Star Alpine Heritage Hotels & Lakeside Resorts");
            p1.setTransportation("Private Luxury Coach & Swiss Travel Pass Express Trains");
            p1.setFood("Daily Continental Breakfast & 4 Gourmet Swiss Fondue Dinners");
            p1.setIncludedItems("All Luxury Accommodations; Swiss Rail Pass; Mount Titlis Cable Car Ticket; Jungfraujoch Peak Excursion; Guided Lake Lucerne Cruise; English Speaking Tour Guide");
            p1.setExcludedItems("International Flight Tickets; Personal Shopping & Alcoholic Beverages; Travel Insurance; Optional Paragliding Activities");
            p1.setItinerary("Day 1: Arrival in Zurich & Historic Old Town Walking Tour\nDay 2: Scenic Train Ride to Lucerne & Lake Cruise\nDay 3: Mount Titlis Snow & Ice Excursion\nDay 4: Transfer to Interlaken & Grindelwald Valley\nDay 5: Top of Europe - Jungfraujoch Mountain Expedition\nDay 6: Lauterbrunnen Waterfalls & Leisure Shopping Day\nDay 7: Departure from Zurich International Airport");
            p1.setFeatured(true);
            packageRepository.save(p1);

            // Package 2: Bali Tropical Paradise Expedition
            TourPackage p2 = new TourPackage();
            p2.setName("Bali Tropical Paradise & Culture");
            p2.setDestination("Ubud, Seminyak & Nusa Penida, Indonesia");
            p2.setDescription("Discover lush green rice terraces, sacred Hindu temples, private beachfront villas, vibrant sunset beach clubs, and turquoise island waters.");
            p2.setImageUrl("https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80");
            p2.setDurationDays(6);
            p2.setPrice(new BigDecimal("999.00"));
            p2.setAccommodation("Luxury Private Pool Villa & Oceanfront Resort");
            p2.setTransportation("Private Chauffeur-driven AC SUV throughout island");
            p2.setFood("All Breakfasts, Balinese Feast & Sunset Beach Dinner");
            p2.setIncludedItems("Private Pool Villa Stay; Fast Boat to Nusa Penida; Kintamani Volcano Tour; Sacred Monkey Forest Entrance; Balinese Spa Session; Airport Pickup & Drop");
            p2.setExcludedItems("Flight Tickets; Visa Fees; Personal Expenses & Tipping");
            p2.setItinerary("Day 1: Arrival in Denpasar & Check-in at Seminyak Resort\nDay 2: Ubud Cultural Tour - Tegallalang Rice Terrace & Monkey Forest\nDay 3: Kintamani Volcano View & Tirta Empul Holy Springs\nDay 4: Nusa Penida Island Speedboat Day Tour & Kelingking Beach\nDay 5: Uluwatu Temple Sunset & Kecak Fire Dance\nDay 6: Traditional Spa Session & Transfer to Airport");
            p2.setFeatured(true);
            packageRepository.save(p2);

            // Package 3: Royal Rajasthan Heritage Journey
            TourPackage p3 = new TourPackage();
            p3.setName("Royal Rajasthan Heritage & Forts");
            p3.setDestination("Jaipur, Jodhpur & Udaipur, India");
            p3.setDescription("Step into a fairytale world of grand palaces, majestic hilltop forts, vibrant desert bazaars, royal heritage hospitality, and serene lake cruises.");
            p3.setImageUrl("https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80");
            p3.setDurationDays(8);
            p3.setPrice(new BigDecimal("1299.00"));
            p3.setAccommodation("5-Star Heritage Haveli & Palace Hotels");
            p3.setTransportation("Private AC SUV with Professional Driver");
            p3.setFood("Daily Royal Breakfast & Authentic Rajasthani Thali Dinners");
            p3.setIncludedItems("Heritage Palace Stays; All Monument Entrance Tickets; Lake Pichola Boat Ride in Udaipur; Amer Fort Elephant/Jeep Safari; Local Cultural Folk Show");
            p3.setExcludedItems("Airfares; Personal Shopping; Laundry & Tips");
            p3.setItinerary("Day 1: Arrival in Jaipur (The Pink City) & City Palace Visit\nDay 2: Amer Fort, Hawa Mahal & Jal Mahal Exploration\nDay 3: Drive to Jodhpur (The Blue City) & Mehrangarh Fort Tour\nDay 4: Umaid Bhawan Palace & Jaswant Thada\nDay 5: Scenic Drive to Udaipur via Ranakpur Jain Temple\nDay 6: Udaipur City Palace & Evening Boat Cruise on Lake Pichola\nDay 7: Saheliyon Ki Bari & Crafts Village Tour\nDay 8: Departure from Udaipur Airport");
            p3.setFeatured(true);
            packageRepository.save(p3);

            // Package 4: Amalfi Coast & Tuscan Sun Dream
            TourPackage p4 = new TourPackage();
            p4.setName("Amalfi Coast & Tuscan Sun Dream");
            p4.setDestination("Florence, Siena, Positano & Capri, Italy");
            p4.setDescription("Indulge in Italian romance with wine tasting in Tuscan vineyards, Renaissance art galleries in Florence, and dramatic cliffside sea views in Positano.");
            p4.setImageUrl("https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80");
            p4.setDurationDays(9);
            p4.setPrice(new BigDecimal("2499.00"));
            p4.setAccommodation("Boutique Tuscan Villa & Positano Cliffside Hotel");
            p4.setTransportation("High-Speed Frecciarossa Train & Private Coastal Transfers");
            p4.setFood("Breakfasts, 2 Vineyard Wine Tasting Lunches & Pasta Making Class");
            p4.setIncludedItems("Capri Private Boat Tour; Chianti Vineyard Wine Tasting; Uffizi Gallery Fast-Track Pass; Sorrento Coast Transfer");
            p4.setExcludedItems("Flights; City Tourist Taxes; Unscheduled Meals");
            p4.setItinerary("Day 1: Arrival in Florence & Duomo Sunset Walk\nDay 2: Uffizi Gallery & Ponte Vecchio Walking Tour\nDay 3: Tuscan Countryside Tour - Siena, San Gimignano & Chianti Wine Tasting\nDay 4: High-Speed Train to Naples & Transfer to Positano\nDay 5: Positano Cliffside Village Exploration & Beach Relaxation\nDay 6: Day Excursion to Capri & Blue Grotto Boat Tour\nDay 7: Amalfi & Ravello Scenic Drive\nDay 8: Pompeii Archaeological Guided Tour\nDay 9: Departure from Naples International Airport");
            p4.setFeatured(false);
            packageRepository.save(p4);

            // Package 5: Wonders of Japan - Cherry Blossom & Tech
            TourPackage p5 = new TourPackage();
            p5.setName("Wonders of Japan - Tradition & Innovation");
            p5.setDestination("Tokyo, Kyoto, Nara & Mount Fuji, Japan");
            p5.setDescription("Immerse yourself in Japan's mesmerizing fusion of futuristic neon cities, ancient Shinto shrines, Shinkansen bullet trains, and Mount Fuji vistas.");
            p5.setImageUrl("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80");
            p5.setDurationDays(8);
            p5.setPrice(new BigDecimal("2199.00"));
            p5.setAccommodation("Premium City Hotels & Traditional Ryokan with Onsen Bath");
            p5.setTransportation("7-Day JR Pass (Shinkansen Bullet Train) & Airport Express");
            p5.setFood("Daily Breakfast & Authentic Kaiseki Banquet Dinner at Ryokan");
            p5.setIncludedItems("JR Bullet Train Pass; TeamLab Planets Ticket; Fushimi Inari & Arashiyama Bamboo Grove Tour; Mount Fuji 5th Station Excursion; Tea Ceremony Experience");
            p5.setExcludedItems("International Flights; Pocket Wi-Fi Rental (Optional); Personal Meals");
            p5.setItinerary("Day 1: Arrival in Tokyo Narita/Haneda & Shinjuku Neon Night Tour\nDay 2: Asakusa Senso-ji Temple & Shibuya Crossing\nDay 3: Mount Fuji Day Tour & Hakone Cable Car\nDay 4: Shinkansen Bullet Train Ride to Kyoto & Traditional Ryokan Stay\nDay 5: Arashiyama Bamboo Forest & Fushimi Inari Shrine\nDay 6: Day Trip to Nara Deer Park & Todai-ji Giant Buddha\nDay 7: Osaka Dotonbori Street Food & Shopping\nDay 8: Return Shinkansen to Tokyo & Departure");
            p5.setFeatured(true);
            packageRepository.save(p5);

            System.out.println(">>> Seeded 5 Tour Packages successfully!");
        }
    }

    private void seedPlaces() {
        if (placeRepository.count() == 0) {
            // Place 1: Santorini (Beaches/Nature)
            Place pl1 = new Place();
            pl1.setName("Santorini Caldera & Oia");
            pl1.setLocation("Cyclades, Greece");
            pl1.setCategory(PlaceCategory.BEACHES);
            pl1.setDescription("Iconic whitewashed buildings overlooking the Aegean Sea, dramatic volcanic cliffs, world-famous sunsets in Oia, and red sand beaches.");
            pl1.setImageUrl("https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80");
            pl1.setEstimatedCost(new BigDecimal("350.00"));
            pl1.setRecommendedDuration("3-4 Days");
            pl1.setBestTimeToVisit("April to October");
            pl1.setAttractions("Oia Sunset Viewpoint, Akrotiri Archaeological Site, Red Beach, Fira-Oia Cliff Hike, Volcanic Hot Springs Cruise");
            pl1.setPopular(true);
            placeRepository.save(pl1);

            // Place 2: Swiss Matterhorn (Mountains)
            Place pl2 = new Place();
            pl2.setName("Matterhorn & Zermatt Peak");
            pl2.setLocation("Zermatt, Valais, Switzerland");
            pl2.setCategory(PlaceCategory.MOUNTAINS);
            pl2.setDescription("The majestic pyramid-shaped peak of the Alps, car-free alpine village of Zermatt, world-class skiing, and Gornergrat cogwheel railway views.");
            pl2.setImageUrl("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80");
            pl2.setEstimatedCost(new BigDecimal("450.00"));
            pl2.setRecommendedDuration("2-3 Days");
            pl2.setBestTimeToVisit("December to March (Skiing) & June to September (Hiking)");
            pl2.setAttractions("Gornergrat Bahn, Glacier Paradise, Matterhorn Museum, Five Lakes Trail, Alpine Ski Runs");
            pl2.setPopular(true);
            placeRepository.save(pl2);

            // Place 3: Machu Picchu (Historical)
            Place pl3 = new Place();
            pl3.setName("Machu Picchu Sanctuary");
            pl3.setLocation("Cusco Region, Peru");
            pl3.setCategory(PlaceCategory.HISTORICAL);
            pl3.setDescription("The mystical 15th-century Incan citadel perched high in the Andes mountains surrounded by cloud forests and ancient stonework.");
            pl3.setImageUrl("https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=80");
            pl3.setEstimatedCost(new BigDecimal("300.00"));
            pl3.setRecommendedDuration("2 Days");
            pl3.setBestTimeToVisit("May to October (Dry Season)");
            pl3.setAttractions("Temple of the Sun, Huayna Picchu Peak Hike, Intihuatana Stone, Inca Trail Trek, Sacred Valley");
            pl3.setPopular(true);
            placeRepository.save(pl3);

            // Place 4: Varanasi Ghats (Religious)
            Place pl4 = new Place();
            pl4.setName("Varanasi Sacred River Ghats");
            pl4.setLocation("Uttar Pradesh, India");
            pl4.setCategory(PlaceCategory.RELIGIOUS);
            pl4.setDescription("One of the world's oldest continually inhabited cities, sacred Ganges riverfront ghats, spiritual evening Ganga Aarti rituals, and ancient temples.");
            pl4.setImageUrl("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80");
            pl4.setEstimatedCost(new BigDecimal("120.00"));
            pl4.setRecommendedDuration("2-3 Days");
            pl4.setBestTimeToVisit("October to March");
            pl4.setAttractions("Dashashwamedh Ghat Evening Aarti, Sunrise Boat Ride, Kashi Vishwanath Temple, Sarnath Buddhist Stupa, Old City Alleys");
            pl4.setPopular(true);
            placeRepository.save(pl4);

            // Place 5: Queenstown (Adventure)
            Place pl5 = new Place();
            pl5.setName("Queenstown Adventure Hub");
            pl5.setLocation("South Island, New Zealand");
            pl5.setCategory(PlaceCategory.ADVENTURE);
            pl5.setDescription("The world's capital of adrenaline adventure sports nestled on Lake Wakatipu with a backdrop of the dramatic Remarkables mountain range.");
            pl5.setImageUrl("https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1000&q=80");
            pl5.setEstimatedCost(new BigDecimal("400.00"));
            pl5.setRecommendedDuration("3-5 Days");
            pl5.setBestTimeToVisit("November to April");
            pl5.setAttractions("Kawarau Bridge Bungee Jump, Shotover Jet Boating, Skyline Gondola & Luge, Milford Sound Scenic Cruise, Helicopter Glacier Tour");
            pl5.setPopular(true);
            placeRepository.save(pl5);

            // Place 6: Serengeti National Park (Wildlife)
            Place pl6 = new Place();
            pl6.setName("Serengeti Great Migration");
            pl6.setLocation("Arusha Region, Tanzania");
            pl6.setCategory(PlaceCategory.WILDLIFE);
            pl6.setDescription("Vast endless savannah grasslands hosting millions of wildebeest, zebras, lions, leopards, and elephants in the world's greatest wildlife spectacle.");
            pl6.setImageUrl("https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80");
            pl6.setEstimatedCost(new BigDecimal("600.00"));
            pl6.setRecommendedDuration("4-5 Days");
            pl6.setBestTimeToVisit("June to October (Great Migration)");
            pl6.setAttractions("Grumeti & Mara River Crossings, Ngorongoro Crater Safari, Hot Air Balloon Safari, Maasai Cultural Village Visit");
            pl6.setPopular(true);
            placeRepository.save(pl6);

            // Place 7: Tokyo Neon Metropolis (City)
            Place pl7 = new Place();
            pl7.setName("Tokyo Neon & Culinary Hub");
            pl7.setLocation("Tokyo, Japan");
            pl7.setCategory(PlaceCategory.CITY);
            pl7.setDescription("A hyper-modern urban wonderland featuring glowing skyscrapers, historic wooden shrines, Michelin-star dining, pop culture, and bullet-fast transit.");
            pl7.setImageUrl("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80");
            pl7.setEstimatedCost(new BigDecimal("350.00"));
            pl7.setRecommendedDuration("4-6 Days");
            pl7.setBestTimeToVisit("March to May & September to November");
            pl7.setAttractions("Shibuya Sky Observatory, Senso-ji Temple, Akihabara Electric Town, Tsukiji Outer Fish Market, Meiji Shrine Forest");
            pl7.setPopular(true);
            placeRepository.save(pl7);

            // Place 8: Banff National Park (Nature)
            Place pl8 = new Place();
            pl8.setName("Banff & Lake Louise");
            pl8.setLocation("Alberta, Canada");
            pl8.setCategory(PlaceCategory.NATURE);
            pl8.setDescription("Unreal turquoise glacial lakes, towering Rocky Mountain peaks, pine forest valleys, hot springs, and abundant Canadian wildlife.");
            pl8.setImageUrl("https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1000&q=80");
            pl8.setEstimatedCost(new BigDecimal("320.00"));
            pl8.setRecommendedDuration("3-4 Days");
            pl8.setBestTimeToVisit("June to September (Lakes) & December to March (Skiing)");
            pl8.setAttractions("Lake Louise Canoe Ride, Moraine Lake Valley of Ten Peaks, Icefields Parkway Drive, Banff Gondola, Upper Hot Springs");
            pl8.setPopular(true);
            placeRepository.save(pl8);

            // Place 9: Dubai Marina & Desert (City/Adventure)
            Place pl9 = new Place();
            pl9.setName("Dubai Marina & Desert Safari");
            pl9.setLocation("Dubai, United Arab Emirates");
            pl9.setCategory(PlaceCategory.CITY);
            pl9.setDescription("Ultramodern architecture featuring the tallest tower Burj Khalifa, artificial palm islands, luxury shopping malls, and thrilling dune bashing safaris.");
            pl9.setImageUrl("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80");
            pl9.setEstimatedCost(new BigDecimal("400.00"));
            pl9.setRecommendedDuration("3-5 Days");
            pl9.setBestTimeToVisit("November to March");
            pl9.setAttractions("Burj Khalifa At The Top, Red Dune Desert Safari with BBQ, Dubai Mall Fountain Show, Palm Jumeirah Monorail, Gold Souk");
            pl9.setPopular(false);
            placeRepository.save(pl9);

            // Place 10: Maldives Atolls (Beaches)
            Place pl10 = new Place();
            pl10.setName("Maldives Overwater Atolls");
            pl10.setLocation("North Malé Atoll, Maldives");
            pl10.setCategory(PlaceCategory.BEACHES);
            pl10.setDescription("Pure tropical paradise with overwater bungalow villas, pristine white sand beaches, crystal clear lagoons, and vibrant coral reef marine life.");
            pl10.setImageUrl("https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80");
            pl10.setEstimatedCost(new BigDecimal("700.00"));
            pl10.setRecommendedDuration("4-5 Days");
            pl10.setBestTimeToVisit("November to April");
            pl10.setAttractions("Overwater Bungalow Stay, Snorkeling with Manta Rays & Sea Turtles, Sunset Dolphin Cruise, Underwater Dining Experience");
            pl10.setPopular(true);
            placeRepository.save(pl10);

            System.out.println(">>> Seeded 10 Destinations successfully!");
        }
    }
}
