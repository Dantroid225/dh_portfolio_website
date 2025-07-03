import { ActorGrid } from '@/shared/components';

const Contact = () => {
  return (
    <div className='pt-16 section-padding'>
      <div className='container-custom'>
        <h1 className='text-4xl font-bold mb-8'>Contact</h1>

        {/* Actor Grid for Testing */}
        <div className='mb-12'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800'>
            Database Testing - Actor Grid
          </h2>
          <ActorGrid />
        </div>

        <div className='mt-8'>
          <p className='text-gray-400'>Contact form coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
