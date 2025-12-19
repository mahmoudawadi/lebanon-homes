"use client";

import React from "react";
import Link from "next/link";
import { FiPhone, FiMail, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const AgentCard = ({ agent }: any) => {
  if (!agent) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="text-center mb-6">
        {agent.photo ? (
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-400">{agent.name[0]}</span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-luxury-dark mb-2">
          {agent.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {agent.propertiesSold} Properties Sold
        </p>
        {agent.languages && agent.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {agent.languages.map((lang: string) => (
              <span
                key={lang}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <a
          href={`tel:${agent.phone}`}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiPhone className="w-5 h-5 text-luxury-gold" />
          <span className="text-gray-700">{agent.phone}</span>
        </a>
        <a
          href={`mailto:${agent.email}`}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiMail className="w-5 h-5 text-luxury-gold" />
          <span className="text-gray-700">{agent.email}</span>
        </a>
        {agent.whatsapp && (
          <a
            href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaWhatsapp className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">WhatsApp</span>
          </a>
        )}
        <Link
          href={`/agent/${agent.slug}`}
          className="block w-full text-center bg-luxury-gold text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default AgentCard;


