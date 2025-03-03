import { ExternalLink, Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { Separator } from './ui/separator';

type Props = {};

export const Footer = (props: Props) => {

  const teamMembers = [
    { name: "Carney Immanuel Sentosa", github: "crzie" },
    { name: "Davis Kelvin", github: "daviskelvin824" },
    { name: "Farrel Tobias Saputro", github: "farreltobias24" },
    { name: "Gavind Beckham Loka", github: "gavindloka" },
    { name: "Nenlitio Christian", github: "nenlitiochristian" },
  ]

  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <footer className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-800">
        <div
          className="absolute inset-0 opacity-10"
        ></div>
      </div>

      <div className="relative px-4 md:px-8 lg:px-28 py-16">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
              <h3 className="text-3xl font-bold mb-6 text-white relative">
                Proof Of Research
                <span className="absolute -bottom-2 left-0 w-72 h-1 bg-gradient-to-r from-purple-400 to-pink-500"></span>
              </h3>
              <p className="text-purple-100 mb-8 max-w-md text-lg">
                Revolutionizing research with blockchain technology and
                decentralized AI for secure, verified survey responses.
              </p>
              <div className="flex space-x-5">
                <a href="#" className="group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-6 text-white relative">
                Our Team
                <span className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-500"></span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <a
                    key={index}
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    onMouseEnter={() => setHoveredMember(index)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    <div
                      className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                        hoveredMember === index
                          ? 'bg-white/15 translate-y-[-4px] shadow-lg shadow-purple-900/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <Github className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {member.name}
                          </p>
                          <p className="text-purple-200 text-sm flex items-center gap-1">
                            @{member.github}
                            <ExternalLink
                              className={`h-3 w-3 transition-opacity duration-300 ${
                                hoveredMember === index
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              }`}
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="my-12 relative">
            <Separator className="bg-white/10" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-200 text-sm backdrop-blur-sm px-4 py-2 rounded-full bg-white/5">
              © 2025 Proof Of Research. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
