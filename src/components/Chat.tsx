import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";

export default function Chat() {
  return (
    <Accordion type="single" collapsible className="flexs relative z-40">
      <AccordionItem
        value="item-1"
        className="fixed bottom-8 right-8 w-80 rounded-md border bg-background"
      >
        <AccordionTrigger className="border-b px-6">
          <span className="text-sm font-medium">Support Indisponible</span>
        </AccordionTrigger>
        <AccordionContent className="flex max-h-96 min-h-80 flex-col justify-between p-0">
          <div className="p-4 text-sm text-muted-foreground">
            Le service de chat est désactivé pour le moment.
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

