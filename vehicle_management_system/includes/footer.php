</main>
    
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5><i class="fas fa-car me-2"></i>VehicleMS</h5>
                    <p>Your trusted partner for vehicle rental and mechanic services. Quality service guaranteed.</p>
                    <div class="social-links">
                        <a href="#" class="text-light me-3"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="text-light me-3"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-light me-3"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-light"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
                <div class="col-md-4">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="/index.php" class="text-light text-decoration-none">Home</a></li>
                        <li><a href="/vehicles.php" class="text-light text-decoration-none">Rent Vehicles</a></li>
                        <li><a href="/mechanic_service.php" class="text-light text-decoration-none">Mechanic Service</a></li>
                        <li><a href="/contact.php" class="text-light text-decoration-none">Contact Us</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Contact Info</h5>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-map-marker-alt me-2"></i>123 Vehicle Street, Car City, CC 12345</li>
                        <li><i class="fas fa-phone me-2"></i>+1 (555) 123-4567</li>
                        <li><i class="fas fa-envelope me-2"></i>info@vehiclems.com</li>
                        <li><i class="fas fa-clock me-2"></i>24/7 Service Available</li>
                    </ul>
                </div>
            </div>
            <hr class="my-4">
            <div class="row">
                <div class="col-md-6">
                    <p class="mb-0">&copy; <?php echo date('Y'); ?> Vehicle Management System. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">
                        <a href="#" class="text-light text-decoration-none me-3">Privacy Policy</a>
                        <a href="#" class="text-light text-decoration-none">Terms of Service</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Bootstrap JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    <script src="/js/main.js"></script>
    <script src="/js/validation.js"></script>
    
    <!-- Additional scripts -->
    <?php if (isset($additionalScripts)) echo $additionalScripts; ?>
</body>
</html>