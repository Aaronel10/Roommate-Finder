import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";

import IconButton from "../components/Inputs/IconButton";
import TitlesCard from "../components/Surfaces/Project/QuestionsCard";
import TranscriptsCard from "../components/Surfaces/Project/ViewQuestionCard";
import { transitionVariants } from "../styles/motion-definitions";

export default function Quiz() {
  return (
    <>
      <Head>
        <title>Quiz — Prepost</title>
      </Head>
      <motion.main
        initial={"fadeOut"}
        animate={"fadeIn"}
        exit={"fadeOut"}
        variants={transitionVariants}
        className={"flex justify-center"}
      >
        <div
          className={
            "flex w-full max-w-7xl flex-col justify-center gap-4 p-4 sm:p-6 lg:p-8"
          }
        >
          <Link scroll={false} href={"/explore"} className={"w-fit"}>
            <IconButton className={"group gap-1"}>
              <ChevronLeftIcon
                className={
                  "h-6 w-6 transition-transform group-hover:-translate-x-1"
                }
              />
              Go Back to Explore
            </IconButton>
          </Link>
          <section
            className={"flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-6"}
          >
            <div className={"mx-auto flex w-3/5 flex-col content-center gap-4"}>
              <TitlesCard
                isLoading={true}
                titlesData={[]}
                className={"bg-slate-50"}
              />
            </div>
          </section>
        </div>
      </motion.main>
    </>
  );
}
