"use client";

import React, { useState } from "react";
import Image from "next/image";

const messages = [

  {
    name: "M. A. Quader (Anu)",
    designation: "President",
    title: "Message from the President",
    image: "/images/President.jpg",
    shortMessage:
      "On behalf of Gulshan Club Limited, I extend a warm welcome to all participating clubs, athletes, and guests joining us for the 5th Inter-Club Sports Carnival The Gulshan Club Olympiad 2025. Over the years, this Olympiad has become a proud tradition that unites clubs across Bangladesh in the spirit of sports, friendship, and healthy competition.",
    fullMessage: (
      <>
        On behalf of Gulshan Club Limited, I extend a warm&nbsp;welcome&nbsp;to
        all participating clubs, athletes, and guests joining us for the 5th
        Inter-Club Sports Carnival The Gulshan Club Olympiad 2025. Over the
        years, this Olympiad has become a proud tradition that unites clubs
        across Bangladesh in the spirit of sports, friendship, and healthy
        competition.
        <br />
        <br />
        What began as a vision in 2019 has today grown into one of the most
        anticipated events in the social club calendar. The Olympiad is a true
        celebration of talent, teamwork, and shared values. It is not just about
        winning medals but about building relationships, inspiring future
        generations, and strengthening the ties between our communities.
        <br />
        <br />
        The success of this event is the result of extraordinary teamwork. I
        commend our Organizing Committee, convenors, and volunteers for their
        dedication, and I offer special thanks to our Chairman of the Organizing
        Committee, Mr. Tareq Rahman, for his tireless leadership and vision.
        <br />
        <br />
        We also express our sincere gratitude to our sponsors and
        partners—Standard Chartered Bank, Prime Bank PLC, Brac Bank PLC, Gulshan
        Youth Club, and our Media Partners—for their steadfast support, which
        makes this Olympiad possible year after year.
        <br />
        <br />
        As President of Gulshan Club, I take immense pride in carrying forward
        this legacy of unity, sportsmanship, and excellence. May this Olympiad
        be remembered not only for its competitions but also for the friendships
        and memories created along the way.
        <br />
        <br />
        <strong>
          Welcome to Olympiad 2025. Let us celebrate the joy of
          sports&nbsp;together.
        </strong>
      </>
    ),
  },
  {
    name: "Tareq Rahman",
    designation: "Chairman",
    title: "Message from the Chairman",
    image: "/images/Chairman.jpg",
    shortMessage:
      "It gives me immense joy to welcome all participating clubs of Bangladesh to the 5th Inter-Club Sports Carnival 'The Gulshan Club Olympiad 2025'. What began in 2019 as a bold initiative to bring social clubs together has now grown into a signature tradition of sporting excellence, friendship, and celebration.",
    fullMessage: (
      <>
        It gives me immense joy to welcome all participating clubs of Bangladesh
        to the 5th Inter-Club Sports Carnival &ldquo;The Gulshan Club Olympiad
        2025&rdquo;. What began in 2019 as a bold initiative to bring social
        clubs together has now grown into a signature tradition of sporting
        excellence, friendship, and celebration.
        <br />
        <br />
        This year, we are honored to host 22 esteemed clubs, 24 teams, and more
        than 1,200 athletes, competing across 17 sports in 34 categories. Beyond
        the thrill of competition, this Olympiad is a stage for building
        friendships, strengthening unity, and deepening the bonds that connect
        our diverse communities.
        <br />
        <br />
        The legacy of the Olympiad is carried forward by the tireless efforts of
        our convenors, volunteers, and organizing committee. Their commitment
        ensures that every detail, from planning to execution, meets the highest
        standards.
        <br />
        <br />
        I also extend my heartfelt gratitude to the President and Board of
        Directors of Gulshan Club Ltd. for their steadfast guidance, and to all
        participating clubs for embracing the true spirit of this gathering.
        <br />
        <br />
        We are deeply grateful to our sponsors and partners whose support has
        made this journey possible: Diamond Sponsor, Standard Chartered Bank,
        Platinum Sponsor Prime Bank PLC, Gold Sponsor Brac Bank PLC, Venue
        Partner - Gulshan Youth Club and our Media Partners, who amplify the
        reach of this celebration.
        <br />
        <br />
        As Chairman of the Organizing Committee, it is my privilege to continue
        this remarkable journey for the fifth consecutive year. Together, let us
        honor the values of sportsmanship, teamwork, and solidarity, creating
        memories today that will inspire tomorrow.
        <br />
        <br />
        <strong>
          Welcome to Olympiad 2025. Let us play, compete, and celebrate as one
          family of clubs.
        </strong>
      </>
    ),
  },
];

const MessageSection = () => {
  const [expandedMessages, setExpandedMessages] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleMessage = (messageName: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageName]: !prev[messageName],
    }));
  };

  return (
    <section className="relative bg-neutral-800 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Leadership Messages
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto">
            Hear from our distinguished leaders about the vision and spirit behind Olympiad 2025
          </p>
        </div> */}

        {/* Messages Grid */}
        <div className="grid gap-12 lg:gap-16">
          {messages.map((msg) => (
            <div key={msg.name} className="relative group">
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

              {/* Main Card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                  {/* Profile Section */}
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="relative">
                      {/* Glow Effect */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-all duration-500"></div>

                      {/* Profile Image */}
                      <div className="relative">
                        <Image
                          src={msg.image}
                          alt={msg.name}
                          width={200}
                          height={200}
                          className="rounded-2xl border-4 border-white/30 shadow-2xl object-contain w-48 h-48 lg:w-56 lg:h-56"
                          priority
                        />

                        {/* Decorative Elements */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* Title */}
                    <div className="mb-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        {msg.title}
                      </h3>
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500"></div>
                        <span className="text-orange-300 font-semibold text-lg">
                          {msg.name} - {msg.designation}
                        </span>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500"></div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="prose prose-lg prose-invert max-w-none">
                      <div className="text-gray-200 leading-relaxed space-y-4 text-base lg:text-lg">
                        {expandedMessages[msg.name]
                          ? msg.fullMessage
                          : msg.shortMessage}
                      </div>

                      {/* See More/See Less Button */}
                      <div className="mt-6 flex justify-center lg:justify-start">
                        <button
                          onClick={() => toggleMessage(msg.name)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <span>
                            {expandedMessages[msg.name]
                              ? "See Less"
                              : "See More"}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${
                              expandedMessages[msg.name] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Decorative Quote */}
                    <div className="mt-8 flex items-center justify-center lg:justify-start">
                      <svg
                        className="w-8 h-8 text-orange-400 opacity-60"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">
              Join us in celebrating the spirit of sportsmanship
            </span>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
