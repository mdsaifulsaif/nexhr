"use client";
import { AddDepartmentModal } from "@/components/modals/AddDepartmentModal";
import { useEffect, useState } from "react";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
    <AddDepartmentModal />
      {/* <EditEmployeeModal /> */}
      {/* আরও মোডাল থাকলে এখানে বসবে */}
    </>
  );
};