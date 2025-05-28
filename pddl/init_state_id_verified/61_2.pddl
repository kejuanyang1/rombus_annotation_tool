(define (problem generated)
  (:domain manip)
  (:objects
    container_04 - container
    office_01 office_02 other_04 tool_05 tool_09 - item
  )
  (:init
    (clear office_01)
    (clear office_02)
    (clear other_04)
    (clear tool_05)
    (clear tool_09)
    (handempty)
    (in tool_05 container_04)
    (ontable container_04)
    (ontable office_01)
    (ontable office_02)
    (ontable other_04)
    (ontable tool_09)
  )
  (:goal (and))
)
