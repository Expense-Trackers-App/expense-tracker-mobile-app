import { MobileLayout } from "@/components/MobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How do I add a new expense?", a: "Go to the Home tab and tap the big + button at the bottom center of the screen." },
  { q: "Can I change my currency?", a: "Yes, go to Settings > General > Currency and select your preferred currency." },
  { q: "How are budgets calculated?", a: "Budgets are calculated per category on a monthly basis. You can set them up in the Budgets tab." }
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <MobileLayout>
      <AppHeader title="Help & Support" showBack={true} />
      <div className="px-5 pb-6 space-y-6 pt-4">
        
        <div className="bg-primary/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold">Chat with us</h3>
            <p className="text-sm text-muted-foreground">Typically replies in 5 minutes</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-lg">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border/40 rounded-2xl overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 text-left font-medium"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === i && (
                  <div className="p-4 pt-0 text-sm text-muted-foreground border-t border-border/40 mt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
