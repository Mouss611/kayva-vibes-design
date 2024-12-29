import { User } from "lucide-react";

const testimonials = [
  {
    name: "Marie L.",
    age: 19,
    text: "J'ai adoré la flexibilité des cours et la patience de mon moniteur. Permis réussi du premier coup !",
  },
  {
    name: "Thomas D.",
    age: 23,
    text: "Une approche moderne qui correspond vraiment à nos besoins. Les prix sont très compétitifs.",
  },
  {
    name: "Sarah M.",
    age: 20,
    text: "La plateforme est super intuitive et les cours sont vraiment bien structurés.",
  },
];

const Testimonials = () => {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Ils nous font confiance
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl card-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-dark/60">{testimonial.age} ans</div>
                </div>
              </div>
              <p className="text-dark/80">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;