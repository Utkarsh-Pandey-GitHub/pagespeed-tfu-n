import { useRouter } from "next/router";
import Link from "next/link";
import { cn } from "@/utils/cn";

const Breadcrumb = ({
  classNames,
  textColor,
}: {
  classNames?: string;
  textColor?: string;
}) => {
  const router = useRouter();
  const pathSegments = router.asPath.split("/").filter((segment) => segment);

  return (
    <nav className={classNames}>
      <ul className="flex space-x-2 overflow-hidden max-md:whitespace-nowrap text-ellipsis">
        <li key="home">
          <Link
            href="/"
            className={cn(textColor ? textColor : "text-[#6E7485]")}
          >
            Home
          </Link>
          <span className={cn(textColor ? textColor : "text-[#6E7485]")}>
            {" "}
            &gt;{" "}
          </span>
        </li>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(textColor ? textColor : "text-[#6E7485]")}
              >
                {segment.includes("-") // When mx id exists in slug
                  ? (() => {
                      const words = segment.includes("?")
                        ? (
                            segment.charAt(0).toUpperCase() +
                            segment.slice(1, segment.indexOf("?"))
                          ).split("-")
                        : segment.split("-");
                      if (
                        words.length > 0 &&
                        words[words.length - 1].length === 9
                      ) {
                        words.pop();
                      }
                      return words
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                    })()
                  : segment.includes("?") // When query exists in slug
                  ? segment.charAt(0).toUpperCase() +
                    segment.slice(1, segment.indexOf("?"))
                  : segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
              {index < pathSegments.length - 1 && (
                <span className={cn(textColor ? textColor : "text-[#6E7485]")}>
                  {" "}
                  &gt;{" "}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
