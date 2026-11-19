import React, { createContext, useContext, useState, useEffect } from "react";
import { campaigns as staticCampaigns } from "@/data/campaigns";
import type { Campaign, Proof } from "@/types";

// Static campaigns can gain uploaded proofs at runtime
const initialCampaigns: Campaign[] = staticCampaigns;

interface DonationContextType {
  campaigns: Campaign[];
  donate: (campaignId: string, amount: number) => void;
  addCampaign: (newCampaign: Campaign) => void;
  addProof: (campaignId: string, proofData: Proof) => void;
}

const DonationContext = createContext<DonationContextType | null>(null);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const savedLocal = localStorage.getItem("local_campaigns");
    const localCampaigns = savedLocal ? JSON.parse(savedLocal) : [];
    
    const savedStaticOverrides = localStorage.getItem("static_campaign_overrides");
    const staticOverrides = savedStaticOverrides ? JSON.parse(savedStaticOverrides) : {};
    
    // Merge local campaigns with static ones, applying overrides to static ones
    const merged = [...localCampaigns];
    initialCampaigns.forEach(staticCamp => {
      const override = staticOverrides[staticCamp.id] || {};
      const combinedProofs = [...(staticCamp.proofs || []), ...(override.proofs || [])];
      
      const campaignWithOverrides = {
        ...staticCamp,
        ...override,
        // Ensure arrays are merged or overridden correctly
        proofs: combinedProofs,
        // Auto calculate isAIVerified
        isAIVerified: combinedProofs.some((p: Proof) => p.score >= 90)
      };
      
      if (!merged.find(c => c.id === staticCamp.id)) {
        merged.push(campaignWithOverrides);
      }
    });

    // Ensure all campaigns have isAIVerified calculated
    const finalMerged = merged.map(c => ({
      ...c,
      isAIVerified: c.proofs?.some((p: Proof) => p.score >= 90) || false
    }));

    setCampaigns(finalMerged);
  }, []);

  const donate = (campaignId: string, amount: number) => {
    setCampaigns((prev) => {
      const updated = prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            raisedAmount: (c.raisedAmount || 0) + amount,
            donors: (c.donors || Math.floor(Math.random() * 500) + 200) + 1,
          };
        }
        return c;
      });

      syncToLocalStorage(updated, campaignId);
      return updated;
    });
  };

  const addCampaign = (newCampaign: Campaign) => {
    const campaignWithVerify = {
      ...newCampaign,
      isAIVerified: newCampaign.proofs?.some((p: Proof) => p.score >= 90) || false
    };
    
    setCampaigns((prev) => [campaignWithVerify, ...prev]);
    
    const saved = localStorage.getItem("local_campaigns");
    const localCampaigns = saved ? JSON.parse(saved) : [];
    localStorage.setItem("local_campaigns", JSON.stringify([campaignWithVerify, ...localCampaigns]));
  };

  const addProof = (campaignId: string, proofData: Proof) => {
    setCampaigns((prev) => {
      const updated = prev.map((c) => {
        if (c.id === campaignId) {
          const newProofs = [...(c.proofs || []), proofData];
          return {
            ...c,
            proofs: newProofs,
            // Automatic calculation based on verified proof condition (score >= 90)
            isAIVerified: newProofs.some((p: Proof) => p.score >= 90),
            // Updated after proof submission: raised amount
            raisedAmount: (c.raisedAmount || 0) + Number(proofData.amount),
          };
        }
        return c;
      });

      syncToLocalStorage(updated, campaignId);
      return updated;
    });
  };

  const syncToLocalStorage = (allCampaigns: Campaign[], updatedId: string) => {
    // Determine if it's a local campaign
    const localSaved = localStorage.getItem("local_campaigns");
    const localCampaigns = localSaved ? JSON.parse(localSaved) : [];
    const isLocal = localCampaigns.find((lc: Campaign) => lc.id === updatedId);

    if (isLocal) {
      const updatedLocal = allCampaigns.filter(c => localCampaigns.find((lc: Campaign) => lc.id === c.id));
      localStorage.setItem("local_campaigns", JSON.stringify(updatedLocal));
    } else {
      // It's a static campaign, update overrides
      const staticSaved = localStorage.getItem("static_campaign_overrides");
      const overrides = staticSaved ? JSON.parse(staticSaved) : {};
      
      const updatedCampaign = allCampaigns.find(c => c.id === updatedId);
      if (updatedCampaign) {
        overrides[updatedId] = {
          raisedAmount: updatedCampaign.raisedAmount,
          donors: updatedCampaign.donors,
          isAIVerified: updatedCampaign.isAIVerified,
          proofs: updatedCampaign.proofs?.filter((p: Proof) => !initialCampaigns.find(sc => sc.id === updatedId)?.proofs?.find((sp: Proof) => sp.id === p.id))
        };
        localStorage.setItem("static_campaign_overrides", JSON.stringify(overrides));
      }
    }
  };

  return (
    <DonationContext.Provider value={{ campaigns, donate, addCampaign, addProof }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
};
