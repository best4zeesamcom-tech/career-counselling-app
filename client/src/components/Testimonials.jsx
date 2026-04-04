function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Ayesha Khan",
      role: "Software Engineering Student",
      emoji: "👩‍💻",
      text: "CareerGuide helped me discover my passion for web development. The career quiz was spot-on!",
      rating: 5,
    },
    {
      id: 2,
      name: "Hamza Ali",
      role: "Fresh Graduate",
      emoji: "👨‍🎓",
      text: "Found my first internship through the job board. The resume tips were incredibly helpful!",
      rating: 5,
    },
    {
      id: 3,
      name: "Fatima Raza",
      role: "Medical Student",
      emoji: "👩‍⚕️",
      text: "The career paths for Pre-Medical students are very detailed. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful students who found their path with CareerGuide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">{testimonial.emoji}</div>
                <div>
                  <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-3xl font-bold text-blue-600">5000+</div>
            <div className="text-gray-600">Students Helped</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-3xl font-bold text-blue-600">50+</div>
            <div className="text-gray-600">Career Paths</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-3xl font-bold text-blue-600">1000+</div>
            <div className="text-gray-600">Job Listings</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-3xl font-bold text-blue-600">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;