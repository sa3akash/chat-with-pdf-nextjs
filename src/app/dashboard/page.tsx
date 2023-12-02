
import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import { db } from '@db/index';
import Dashboard from '@components/Dashboard';

const DashboardPage = async () => {

    const user = getKindeServerSession().getUser()

    if(!user || !user.id) return redirect("/auth-callback?origin=dashboard")

    const dbUser = await db.user.findFirst({
      where:{
        id: user.id,
      }

    })

    if(!dbUser) return redirect("/auth-callback?origin=dashboard")


  return (
    <>
      <Dashboard />
    </>
  )
}

export default DashboardPage