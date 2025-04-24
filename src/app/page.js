"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import treeBrain from "../../public/assets/images/treeBrain.png";
import aboutUs from "../../public/assets/images/aboutUs.png";
import { useRouter } from "next/navigation";

const brainFacts = [
  "🧠 The human brain generates about 20 watts of electricity—enough to power a small light bulb!",
  "🔬 Your brain has around 86 billion neurons, each forming thousands of connections.",
  "⏳ It processes information as fast as 268 miles per hour—faster than a Formula 1 car!",
  "💤 Your brain keeps working even while you sleep, processing memories and emotions.",
  "🧩 The brain is about 60% fat, making it one of the fattiest organs in your body.",
  "🖼️ The brain can recognize an image in as little as 13 milliseconds!",
  "🔄 Your brain is constantly rewiring itself through neuroplasticity, adapting to new experiences.",
  "🌡️ The brain operates at about the same temperature as a cup of hot coffee (around 98.6°F / 37°C).",
];

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % brainFacts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
      }
    }
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-purple-300 to-blue-400">
      {/* Background Animation */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Main Content */}
      <div className="relative z-10">
        <header className="w-full px-6 py-4 flex justify-evenly items-center ">
          {" "}
          <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <a href="#about" className="hover:text-purple-600 transition">
              About Us
            </a>

            <a href="#features" className="hover:text-purple-600 transition">
              Key Features
            </a>
            <a href="#brain-facts" className="hover:text-purple-600 transition">
              Brain Facts
            </a>
            <a href="#contact" className="hover:text-purple-600 transition">
              Contact
            </a>
          </nav>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/SignIn")}
              className="bg-[#5dabb4] text-white font-semibold border-2 border-[#5dabb4] px-4 py-2 rounded-lg hover:bg-[#5dabb4] hover:text-white transition"
            >
              Login
            </button>
            <button className="bg-[#5dabb4] text-white font-semibold border-2 border-[#5dabb4] px-4 py-2 rounded-lg hover:bg-[#5dabb4] hover:text-white transition">
              Sign Up
            </button>
          </div>
        </header>

        <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-white opacity-95 text-center leading-tight">
            NEUROCLASSIFY
          </h1>
          <p className="text-white mt-4 text-center max-w-2xl">
            Upload MRI scans and get AI-powered classification for brain tumors
            instantly.
          </p>
          <div className="relative w-full max-w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] mt-10 flex items-center justify-center">
            <Image
              src={treeBrain}
              alt="Brain Image"
              layout="intrinsic"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>
        </div>

        {/* About Us Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto flex flex-col md:flex-row items-center px-6">
            {/* Left: Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={aboutUs}
                alt="Doctors"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>

            {/* Right: Text Content */}
            <div className="w-full md:w-1/2 md:pl-12 mt-8 md:mt-0">
              <h2 className="text-2xl font-bold text-[#5dabb4] mb-4">
                About <span className="text-purple-600">NeuroClassify</span>
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                NeuroClassify is an AI-powered brain tumor identification system
                that leverages deep learning and advanced medical image analysis
                to enhance diagnostic accuracy and efficiency. By classifying
                MRI scans into gliomas, meningiomas, pituitary tumors, or no
                tumor, NeuroClassify aims to support clinicians with reliable,
                real-time diagnostic insights.
              </p>
              <p className="text-base font-extralight text-gray-700 leading-relaxed mt-4">
                The system integrates seamlessly into clinical workflows through
                a user-friendly web-based interface, improving accessibility and
                reducing diagnostic errors.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="px-6 py-16 bg-purple-50 text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Tumor Classification",
                description:
                  "NeuroClassify leverages deep learning models to accurately classify brain tumors from MRI scans, distinguishing between gliomas, meningiomas, pituitary tumors, and non-tumor cases. This reduces human error and enhances diagnostic precision.",
              },
              {
                title: "Real-Time Image Processing",
                description:
                  "The system provides real-time analysis of MRI scans, enabling faster diagnosis and improving clinical decision-making for timely patient care.",
              },
              {
                title: "User-Friendly Interface",
                description:
                  "With an intuitive and accessible web-based interface, medical professionals can seamlessly upload MRI images, view AI-generated diagnostic reports, and integrate results into their workflow with ease.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 10,
                  delay: index * 0.2,
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-[#5dabb4]">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Brain Facts Section */}
        <section
          id="brain-facts"
          className="px-2 py-20 bg-white text-center"
        >
          <h2 className="text-4xl font-extrabold text-purple-700 mb-4 tracking-wide">
            Fascinating Brain Facts
          </h2>
          <div className="mt-10 h-28 flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="p-10 bg-[#5dabb4] shadow-lg rounded-2xl  absolute max-w-xl w-full"
              >
                <p className="text-lg font-medium text-black">
                  {brainFacts[index]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-6 py-16 bg-purple-50 text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-6">
            Contact Us
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Have any questions or want to collaborate? Reach out to us!
          </p>
          <form className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
