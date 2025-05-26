import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../state/hooks";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const Home = () => {
  const navigate = useNavigate();
  const { user, credentials } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user || !credentials) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Welcome, {user.name}!</h1>

        {/* Dashboard Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-4xl mb-8">
          <h2 className="mb-6 text-2xl font-semibold">Dashboard</h2>
          <p className="mb-6">
            Welcome to your dashboard, {user.name}. Here are some quick actions:
          </p>

          <div className="flex gap-4 mb-6">
            <PrimaryButton onClick={() => setIsModalOpen(true)}>
              Open Dialog
            </PrimaryButton>
            <PrimaryButton
              onClick={() => navigate("/order-page")}
              variant="outline"
            >
              Go to Orders
            </PrimaryButton>
            <SecondaryButton onClick={() => console.log("Secondary action")}>
              Another Action
            </SecondaryButton>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-4xl mb-8">
          <h2 className="mb-6 text-2xl font-semibold">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                To get started, simply navigate to the relevant section in the
                dashboard and follow the on-screen instructions. If you need
                further assistance, our support team is available 24/7.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What features are available?</AccordionTrigger>
              <AccordionContent>
                Our platform offers a wide range of features including user
                management, data analytics, and customizable settings. Explore
                the dashboard to discover all available options.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How can I contact support?</AccordionTrigger>
              <AccordionContent>
                You can reach our support team by clicking the help icon in the
                top-right corner of the screen or by emailing
                support@example.com. We typically respond within 24 hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="mb-4 text-lg font-medium">Your Account</h3>
            <p>Email: {credentials.email}</p>
          </div>
          <p>Password: {credentials.password}</p>

          <div className="flex gap-4 mt-4">
            <PrimaryButton
              onClick={() => navigate("/order-test")}
              className="flex-1"
            >
              Order a Test
            </PrimaryButton>
            <PrimaryButton
              onClick={() => navigate("/profile")}
              variant="outline"
              className="flex-1"
            >
              Go to Profile
            </PrimaryButton>
            <SecondaryButton
              onClick={() => navigate("/logout")}
              className="flex-1"
              variant="danger"
            >
              Logout
            </SecondaryButton>
          </div>
        </div>

        {/* Sample Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sample Dialog</DialogTitle>
              <DialogDescription>
                This is a reusable dialog component. You can put any content
                here.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                This is the main content area of the dialog. You can add forms,
                messages, or other UI components here.
              </p>
            </div>
            <DialogFooter className="sm:justify-between">
              <SecondaryButton
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  alert("Action confirmed!");
                  setIsModalOpen(false);
                }}
                type="button"
              >
                Confirm
              </PrimaryButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;
