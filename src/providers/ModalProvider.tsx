"use client";
import { useModalStore } from "@/store/useModalStore";
import { AddDepartmentModal } from "@/components/modals/AddDepartmentModal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  // স্টোর থেকে ডাটা নিন
  const { isOpen, modalType } = useModalStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* যখন isOpen true এবং টাইপ addDepartment হবে তখনই মোডাল দেখাবে */}
      {isOpen && modalType === "addDepartment" && <AddDepartmentModal />}
    </>
  );
};