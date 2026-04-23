"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  BarChart3,
  Plus,
  BookOpen,
  Send,
  Award,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  role: "INSTRUCTOR" | "STUDENT";
}

const INSTRUCTOR_LINKS = [
  { href: "/instructor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/instructor/assignments",
    label: "Assignments",
    icon: FileText,
    children: [
      {
        href: "/instructor/assignments/create",
        label: "Create New",
        icon: Plus,
      },
    ],
  },
  {
    href: "/instructor/submissions",
    label: "Submissions",
    icon: ClipboardList,
  },
  { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
];

const STUDENT_LINKS = [
  { href: "/assignments", label: "Assignments", icon: BookOpen },
  { href: "/my-submissions", label: "My Submissions", icon: Send },
  { href: "/achievements", label: "Achievements", icon: Award },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const links = role === "INSTRUCTOR" ? INSTRUCTOR_LINKS : STUDENT_LINKS;

  const toggleItem = (href: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(href)) {
      newOpenItems.delete(href);
    } else {
      newOpenItems.add(href);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-screen sticky top-0 overflow-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-foreground">
          {role === "INSTRUCTOR" ? "Instructor Panel" : "Student Portal"}
        </h2>
        <Badge variant="secondary" className="mt-2">
          {role}
        </Badge>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const hasChildren = link.children && link.children.length > 0;
          const isParentActive =
            hasChildren &&
            link.children?.some((child) => pathname.startsWith(child.href));

          return (
            <div key={link.href}>
              {hasChildren ? (
                <Collapsible
                  open={openItems.has(link.href) || isParentActive}
                  onOpenChange={() => toggleItem(link.href)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={isParentActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-12 px-3 py-2 text-left",
                        isParentActive && "bg-accent text-accent-foreground",
                      )}
                    >
                      <link.icon className="mr-3 h-5 w-5" />
                      {link.label}
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-8">
                    {link.children?.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant={childActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start h-10 px-3 py-1 text-left text-sm",
                              childActive && "bg-accent text-accent-foreground",
                            )}
                          >
                            <child.icon className="mr-2 h-4 w-4" />
                            {child.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-12 px-3 py-2",
                      isActive && "bg-accent text-accent-foreground",
                    )}
                  >
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.label}
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
