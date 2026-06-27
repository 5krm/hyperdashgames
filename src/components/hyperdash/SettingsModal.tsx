import { Volume2, Sparkles, Zap, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useHyperdash } from "@/lib/hyperdash-store";

export function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { prefs, setPref, reset } = useHyperdash();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/60 bg-gradient-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Settings</DialogTitle>
          <DialogDescription>Tune your HyperDash experience.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Row icon={<Volume2 className="h-4 w-4" />} label="UI Sound Effects" htmlFor="sound">
            <Switch
              id="sound"
              checked={prefs.soundOn}
              onCheckedChange={(v) => setPref("soundOn", v)}
            />
          </Row>
          <Row icon={<Sparkles className="h-4 w-4" />} label="Particle FX" htmlFor="fx">
            <Switch
              id="fx"
              checked={prefs.particleFx}
              onCheckedChange={(v) => setPref("particleFx", v)}
            />
          </Row>
          <Row icon={<Zap className="h-4 w-4" />} label="Reduced Motion" htmlFor="motion">
            <Switch
              id="motion"
              checked={prefs.reducedMotion}
              onCheckedChange={(v) => setPref("reducedMotion", v)}
            />
          </Row>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              toast("Profile reset", { description: "All progress cleared." });
              onOpenChange(false);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset Progress
          </Button>
          <Button onClick={() => onOpenChange(false)} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  icon,
  label,
  htmlFor,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-elevated/60 px-4 py-3">
      <Label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary">
          {icon}
        </span>
        {label}
      </Label>
      {children}
    </div>
  );
}