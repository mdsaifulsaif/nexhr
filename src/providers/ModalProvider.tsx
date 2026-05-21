"use client";
import { useModalStore } from "@/store/useModalStore";
import { AddDepartmentModal } from "@/components/modals/AddDepartmentModal";
import { useEffect, useState } from "react";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { ApplyLeaveModal } from "@/components/modals/ApplyLeaveModal";
import { AddNoticeModal } from "@/components/modals/AddNoticeModal";
import { ViewNoticeModal } from "@/components/modals/ViewNoticeModal";

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
     <ApplyLeaveModal />
     <AddNoticeModal />
     <ViewNoticeModal />
      {isOpen && modalType === "addDepartment" && <AddDepartmentModal />}
    </>
  );
};