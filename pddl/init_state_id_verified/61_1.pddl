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
    (in office_01 container_04)
    (in other_04 container_04)
    (ontable container_04)
    (ontable office_02)
    (ontable tool_05)
    (ontable tool_09)
  )
  (:goal (and))
)
