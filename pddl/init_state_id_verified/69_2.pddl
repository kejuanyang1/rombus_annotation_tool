(define (problem generated)
  (:domain manip)
  (:objects
    container_03 container_05 - container
    office_06 other_04 tool_02 tool_04 tool_06 - item
  )
  (:init
    (clear office_06)
    (clear other_04)
    (clear tool_02)
    (clear tool_04)
    (clear tool_06)
    (handempty)
    (in tool_04 container_05)
    (ontable container_03)
    (ontable container_05)
    (ontable office_06)
    (ontable other_04)
    (ontable tool_02)
    (ontable tool_06)
  )
  (:goal (and))
)
