import { motion } from "framer-motion";
import { LucideProps } from "lucide-react";
import React from "react";

type CardProps = {
  variant?: "default" | "compact";
  title?: string;
  classname?: string;
  children?: React.ReactNode;
  value?: number;
  subtitle?: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  gradient?: string;
};

export function Card({
  title,
  variant,
  children,
  classname,
  value,
  subtitle,
  icon,
  gradient,
}: CardProps) {
  return (
    <>
      {variant === "compact" && (
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white/70 text-slate-700 font-light shadow-lg rounded-2xl p-6 flex justify-between hover:shadow-xl transition-shadow">
            <>
              <div>
                <h1 className="mb-2">{title}</h1>
                <p className={`text-2xl text-slate-900 font-bold`}>{value}</p>
                <p>{subtitle}</p>
              </div>
              <div
                className={`w-12 h-12 flex items-center justify-center bg-linear-to-r ${gradient} rounded-xl shadow-lg`}
              >
                {icon &&
                  React.createElement(icon, {
                    className: "w-6 h-6 text-white",
                  })}
              </div>
            </>
          </div>
        </motion.div>
      )}
      {variant === "default" && (
        <div
          className={`bg-white/70 text-slate-700 font-light shadow-xl rounded-2xl p-6 ${classname}`}
        >
          {children}
        </div>
      )}
    </>
  );
}
