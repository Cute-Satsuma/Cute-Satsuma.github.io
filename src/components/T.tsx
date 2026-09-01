"use client";

type Props = {
  zh: string;
  en: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "li" | "label" | "small";
  className?: string;
};

export function T({ zh, en, as = "span", className }: Props) {
  const Tag = as;
  return (
    <>
      <Tag className={["lang-zh", className].filter(Boolean).join(" ")}>{zh}</Tag>
      <Tag className={["lang-en", className].filter(Boolean).join(" ")}>{en}</Tag>
    </>
  );
}
