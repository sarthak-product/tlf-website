import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./button.module.css";

// Rebuilt from design/components/Button. Three variants:
//   primary    the one main action in a view
//   secondary  supporting actions
//   text       low emphasis actions
// Pass `href` for navigation and you get a real <a>. Leave it out for an action and you
// get a real <button>. Never put two primary buttons in one view.
type Variant = "primary" | "secondary" | "text";

type Common = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof Common>;
type ActionProps = Common & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    keyof Common
  >;

export function Button(props: LinkProps | ActionProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if (props.href !== undefined) {
    const { href, ...anchor } = rest as Omit<LinkProps, keyof Common>;
    return (
      <a {...anchor} href={href} className={classes}>
        {children}
      </a>
    );
  }

  const { type = "button", ...button } = rest as Omit<ActionProps, keyof Common>;
  return (
    <button {...button} type={type} className={classes}>
      {children}
    </button>
  );
}
