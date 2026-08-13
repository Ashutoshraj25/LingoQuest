"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Heart, Snowflake, Zap, Gem, Crown, Check } from "lucide-react";
import { api } from "@/lib/api";

export default function ShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [userGems, setUserGems] = useState(1200);

  useEffect(() => {
    api.getShopItems()
      .then((res) => setItems(res))
      .catch(() => {
        setItems([
          { id: 1, key: "heart_refill", name: "Heart Refill", description: "Refill your hearts to maximum instantly.", price_gems: 350, icon_name: "heart" },
          { id: 2, key: "streak_freeze", name: "Streak Freeze", description: "Protects your streak if you miss a day.", price_gems: 200, icon_name: "snowflake" },
          { id: 3, key: "xp_boost", name: "2x XP Double Boost", description: "Earn double XP on all lessons for 15 minutes.", price_gems: 150, icon_name: "zap" },
          { id: 4, key: "super_membership", name: "LingoQuest Plus", description: "Unlimited Hearts, Zero Ads, and Special Badges.", price_gems: 1000, icon_name: "crown" },
        ]);
      });
  }, []);

  const handlePurchase = (id: number, price: number) => {
    if (userGems < price && price > 0) {
      alert("Not enough gems!");
      return;
    }
    api.purchaseItem(id)
      .then((res) => {
        setUserGems(res.new_gems);
        alert(res.message);
      })
      .catch(() => {
        setUserGems(userGems - price);
        alert("Item purchased!");
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar />
      <Navbar user={{ streak: 5, xp: 450, hearts: 5, gems: userGems, avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex" }} />

      <main className="md:pl-64 pt-16 max-w-4xl mx-auto p-6">
        {/* Shop Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-duo-purple to-purple-600 rounded-3xl text-white shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold font-['Fredoka'] mb-1">LingoQuest Shop</h1>
            <p className="text-purple-100 font-semibold text-sm">Stock up on power-ups, streak freezes, and gem packs!</p>
          </div>
          <ShoppingBag className="w-12 h-12 text-white" />
        </div>

        {/* Super Subscription Spotlight Card */}
        <Card className="mb-8 bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-none p-6 shadow-duo-yellow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Crown className="w-10 h-10 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-['Fredoka']">LingoQuest Plus</h3>
                <p className="text-amber-100 text-sm font-semibold">Unlimited Hearts • Zero Ads • Mastery Reviews</p>
              </div>
            </div>
            <Button variant="white" size="md">
              TRY 14 DAYS FREE
            </Button>
          </div>
        </Card>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl text-duo-purple">
                  {item.key === "heart_refill" ? <Heart className="w-8 h-8 text-duo-red fill-duo-red" /> :
                   item.key === "streak_freeze" ? <Snowflake className="w-8 h-8 text-duo-blue" /> :
                   item.key === "xp_boost" ? <Zap className="w-8 h-8 text-duo-yellow fill-duo-yellow" /> :
                   <Crown className="w-8 h-8 text-amber-500" />}
                </div>
                <div>
                  <h4 className="text-xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">{item.description}</p>
                </div>
              </div>

              <Button variant="purple" size="full" onClick={() => handlePurchase(item.id, item.price_gems)}>
                <Gem className="w-5 h-5 fill-white mr-2 inline" />
                GET FOR {item.price_gems} GEMS
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
