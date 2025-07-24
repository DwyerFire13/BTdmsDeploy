import { Ai } from '@cloudflare/ai';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "POST" && pathname === "/ai-search") {
      const body = await request.json();
      const { target, modality } = body;

      const prompt = `You are a biotech analyst. Based on public information, generate 3 fictional but realistic programs targeting ${target} using ${modality}. Return as CSV with the columns:
company,program,development_stage,target,expected_ind_date,has_in_vivo_data,has_in_vitro_data,modality,received_pre_ind_feedback,ind_enabling_studies_done. Dates should be in YYYY-MM-DD. Use TRUE/FALSE for booleans.`;

      const ai = new Ai(env.AI);
      const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });

      return new Response(response.response, {
        headers: { "Content-Type": "text/plain" }
      });
    }

    return new Response("Endpoint not found", { status: 404 });
  }
};
