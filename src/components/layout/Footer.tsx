import { Lightbulb } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Privacy</span>
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Terms</span>
            Terms
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Support</span>
            Support
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <div className="flex items-center justify-center md:justify-start">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-gray-400 text-sm">
              © 2024 MindMesh. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}