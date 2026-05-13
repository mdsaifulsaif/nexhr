"use client";
import { useModalStore } from "@/store/useModalStore";
import { AddDepartmentModal } from "@/components/modals/AddDepartmentModal";
import { useEffect, useState } from "react";
import { EmployeeModal } from "@/components/modals/EmployeeModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { isOpen, modalType } = useModalStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
     <EmployeeModal />
      {isOpen && modalType === "addDepartment" && <AddDepartmentModal />}
    </>
  );
};