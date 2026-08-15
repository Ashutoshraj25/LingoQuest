"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Heart, Snowflake, Zap, Gem, Crown } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export default function ShopPage() {
  const { user, isGuest } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [userGems, setUserGems] = useState(user.gems || 650);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setUserGems(user.gems || 650);
  }, [user.gems]);

  useEffect(() => {
    if (!isGuest) {
      api.getShopItems()
        .then((res) => setItems(res))
        .catch(() => setItems(DEFAULT_SHOP_ITEMS));
    } else {
      setItems(DEFAULT_SHOP_ITEMS);
    }
  }, [isGuest]);

  const DEFAULT_SHOP_ITEMS = [
    { id: 1, key: "heart_refill", name: "Heart Refill", description: "Refill your hearts to maximum instantly.", price_gems: 350, icon_name: "heart" },
    { id: 2, key: "streak_freeze", name: "Streak Freeze", description: "Protects your streak if you miss a day.", price_gems: 200, icon_name: "snowflake" },
    { id: 3, key: "xp_boost", name: "2x XP Double Boost", description: "Earn double XP on all lessons for 15 minutes.", price_gems: 150, icon_name: "zap" },
    { id: 4, key: "super_membership", name: "LingoQuest Plus", description: "Unlimited Hearts, Zero Ads, and Special Badges.", price_gems: 1000, icon_name: "crown" },
  ];

  const handlePurchase = (id: number, price: number) => {
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
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
        setUserGems((prev) => Math.max(0, prev - price));
        alert("Item purchased!");
      });
  };

  const activeItems = items.length > 0 ? items : DEFAULT_SHOP_ITEMS;

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <Sidebar />
      <Navbar user={{ ...user, gems: userGems }} />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionText="purchase items and save gems"
        returnUrl="/shop"
      />

      <main className="lg:pl-64 pt-16 lg:data-[header-hidden=true]:pt-4 transition-[padding] duration-250 ease-in-out h-screen overflow-y-auto no-scrollbar scroll-smooth max-w-4xl mx-auto p-4 sm:p-6 w-full">
        {/* Shop Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-duo-purple to-purple-600 rounded-3xl text-white shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold font-['Fredoka'] mb-1">LingoQuest Shop</h1>
            <p className="text-purple-100 font-semibold text-sm">Stock up on power-ups, streak freezes, and gem packs!</p>
          </div>
          <ShoppingBag className="w-12 h-12 text-white" />
        </div>

        {/* Super Subscription Spotlight Card */}
        <Card className="mb-8 bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-none p-6 shadow-duo-yellow flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full text-white">PRO MEMBERSHIP</span>
            <h2 className="text-2xl font-extrabold font-['Fredoka']">LingoQuest Super</h2>
            <p className="text-sm font-semibold text-yellow-50 max-w-md">Get Unlimited Hearts, zero interruptions, and double XP boost multipliers!</p>
          </div>
          <Button
            variant="white"
            onClick={() => handlePurchase(4, 1000)}
            className="text-amber-600 font-extrabold uppercase py-3 px-6"
          >
            Upgrade (1,000 <Gem className="w-4 h-4 ml-1 inline text-duo-blue fill-duo-blue" />)
          </Button>
        </Card>

        {/* Power-Up Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeItems.map((item) => (
            <Card key={item.id} className="p-6 flex flex-col justify-between border-2 border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 flex items-center justify-center text-duo-blue text-2xl">
                  {item.icon_name === "heart" && <Heart className="w-7 h-7 text-duo-red fill-duo-red" />}
                  {item.icon_name === "snowflake" && <Snowflake className="w-7 h-7 text-duo-blue" />}
                  {item.icon_name === "zap" && <Zap className="w-7 h-7 text-duo-yellow fill-duo-yellow" />}
                  {item.icon_name === "crown" && <Crown className="w-7 h-7 text-duo-purple" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-800 dark:text-slate-100 font-['Fredoka']">{item.name}</h3>
                  <p className="text-xs font-semibold text-gray-500">{item.description}</p>
                </div>
              </div>

              <Button
                variant="blue"
                size="full"
                onClick={() => handlePurchase(item.id, item.price_gems)}
                className="flex items-center justify-center gap-2"
              >
                <span>GET FOR</span>
                <Gem className="w-4 h-4 text-white fill-white" />
                <span>{item.price_gems} GEMS</span>
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
