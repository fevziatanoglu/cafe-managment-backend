import Cafe from '../models/Cafe.js';

export const getCafeByAdminId = async (req, res) => {
    try {
        const cafe = await Cafe.findOne({  owner: req.user.id });
        if (!cafe) {
            return res.status(404).json({ success: false, message: 'Cafe not found' });
        }
        res.json({ success: true, data: cafe });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new cafe
export const createCafe = async (req, res) => {
  try {
    const { name, address, owner, isActive, image, openingHours } = req.body;
    const cafe = new Cafe({
      name,
      address,
      owner,
      isActive,
      image,
      openingHours,
      slug: await generateSlug(name),
    });
    await cafe.save();
    res.status(201).json({ success: true, data: cafe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing cafe
export const updateCafe = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const cafe = await Cafe.findByIdAndUpdate(id, update, { new: true });
    if (!cafe) {
      return res.status(404).json({ success: false, message: 'Cafe not found' });
    }
    res.json({ success: true, data: cafe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Generate slug for cafe
const generateSlug = async (name) => {
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  let slug = baseSlug;
  let count = 1;
  while (await Cafe.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }
  return slug;
};
